/**
 * Hero controller:
 *  1. intro: title letters rise, the gilded line wipes in, the rest fades up;
 *  2. sky: the WebGL scene when possible (lazy-loaded), else the SVG constellation draws itself;
 *  3. scroll-out: content lifts away and the camera flies into the stars.
 */
import { $$, $req } from '@/scripts/core/dom';
import { prefersReducedMotion } from '@/scripts/core/env';
import { EASE, gsap, ScrollTrigger, SplitText } from '@/scripts/core/motion';
import type { SkyScene } from '@/scripts/sky/SkyScene';
import { supportsWebGL } from '@/scripts/sky/support';

export async function initHero(root: HTMLElement): Promise<void> {
  const reduced = prefersReducedMotion();
  const svg = $req<SVGSVGElement>('[data-hero-constellation]', root);
  const canvas = $req<HTMLCanvasElement>('[data-hero-sky]', root);

  playIntro(root, reduced);

  const sky = reduced ? null : await createSky(canvas, root, svg);
  if (sky) {
    root.classList.add('has-webgl');
    sky.setActive(true);
    sky.playIntro();
  } else {
    drawSvgConstellation(svg, reduced);
  }

  if (!reduced) bindScroll(root, sky);
}

function playIntro(root: HTMLElement, reduced: boolean): void {
  const [first, gilt] = $$('[data-hero-line]', root);
  const fades = $$('[data-hero-in]', root);
  if (!first || !gilt) return;

  if (reduced) {
    gsap.set([first, gilt], { visibility: 'visible' });
    gsap.set(fades, { opacity: 1, y: 0 });
    return;
  }

  const chars = SplitText.create(first, { type: 'chars', mask: 'chars' }).chars;
  gsap.set([first, gilt], { visibility: 'visible' });

  gsap
    .timeline({ delay: 0.25 })
    .from(chars, { yPercent: 115, duration: 1.4, stagger: 0.045, ease: EASE.out })
    .fromTo(
      gilt,
      { clipPath: 'inset(-10% 100% -20% 0)', x: -30 },
      { clipPath: 'inset(-10% -5% -20% 0)', x: 0, duration: 1.8, ease: EASE.inOut },
      0.45,
    )
    .to(fades, { opacity: 1, y: 0, duration: 1.4, stagger: 0.12 }, 0.9);
}

async function createSky(
  canvas: HTMLCanvasElement,
  root: HTMLElement,
  svg: SVGSVGElement,
): Promise<SkyScene | null> {
  if (!supportsWebGL()) return null;
  try {
    const { SkyScene } = await import('@/scripts/sky/SkyScene');
    return new SkyScene(canvas, root, svg);
  } catch (error) {
    console.warn('WebGL sky unavailable, using the SVG constellation.', error);
    return null;
  }
}

/** Fallback: the SVG lines draw in order, then the stars bloom. */
function drawSvgConstellation(svg: SVGSVGElement, reduced: boolean): void {
  if (reduced) return;
  const lines = svg.querySelectorAll('.edge');
  const starsEls = svg.querySelectorAll('.star');
  gsap
    .timeline({ delay: 0.6 })
    .from(starsEls, { opacity: 0, scale: 0, transformOrigin: 'center', stagger: 0.04, duration: 0.8 })
    .fromTo(
      lines,
      { strokeDashoffset: 1, strokeDasharray: '1 1' },
      { strokeDashoffset: 0, duration: 0.6, stagger: 0.12, ease: EASE.inOut },
      0.3,
    );
}

function bindScroll(root: HTMLElement, sky: SkyScene | null): void {
  const content = $req('[data-hero-content]', root);
  gsap
    .timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self: ScrollTrigger) => sky?.setScroll(self.progress),
        onToggle: (self: ScrollTrigger) => sky?.setActive(self.isActive),
      },
    })
    .to(content, { yPercent: -28, opacity: 0, ease: 'none' }, 0)
    .to('.hero__caption, .hero__cue', { opacity: 0, ease: 'none', duration: 0.3 }, 0);
}
