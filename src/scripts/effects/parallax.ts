/**
 * Scroll parallax, opted into from markup:
 *
 *   data-parallax="0.3"   (desktop only) the element drifts against the scroll; larger = stronger,
 *                         negative = reverse. Off on narrow screens, where layouts stack and
 *                         drifting blocks could overlap.
 *   data-parallax-img     (all sizes) an image inside an overflow-hidden frame slides within it
 */
import { $$ } from '@/scripts/core/dom';
import { MQ } from '@/scripts/core/env';
import { gsap } from '@/scripts/core/motion';

/** Travel in px for a speed of 1. */
const TRAVEL = 140;

export function initParallax(): void {
  const mm = gsap.matchMedia();

  mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
    for (const el of $$('[data-parallax]')) {
      const speed = Number(el.dataset['parallax']) || 0.2;
      gsap.fromTo(
        el,
        { y: () => speed * TRAVEL },
        {
          y: () => -speed * TRAVEL,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }
  });

  mm.add(MQ.motion, () => {
    for (const img of $$('[data-parallax-img]')) {
      gsap.fromTo(
        img,
        { yPercent: -7, scale: 1.16 },
        {
          yPercent: 7,
          scale: 1.16,
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement ?? img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    }
  });
}
