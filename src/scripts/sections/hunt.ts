/**
 * The Hunt: a pinned stage where scrolling plays the seven tapestries in sequence.
 * Each step: the old text leaves, the next tapestry wipes up like a curtain while the
 * camera eases toward its focal point, then the new text arrives and holds for reading.
 * The numeral dots jump straight to a chapter. (No ScrollTrigger snap: it fights Lenis.)
 */
import { $$, $req } from '@/scripts/core/dom';
import { MQ } from '@/scripts/core/env';
import { gsap, ScrollTrigger } from '@/scripts/core/motion';
import { scrollToTarget } from '@/scripts/core/smooth-scroll';
import { primeImages } from '@/scripts/effects/images';

/** Timeline units per chapter: ~1 unit of transition, the rest is a reading pause. */
const STEP = 2;

export function initHunt(root: HTMLElement): void {
  const stage = $req('[data-hunt-stage]', root);
  const chapters = $$('[data-chapter]', root);
  const dotsNav = $req('[data-hunt-dots]', root);
  const dots = $$<HTMLButtonElement>('[data-hunt-dot]', root);

  gsap.matchMedia().add(MQ.motion, () => {
    root.classList.add('is-staged');
    primeImages(root);
    dotsNav.hidden = false;

    const arts = chapters.map((c) => $req('.chapter__art', c));
    const texts = chapters.map((c) => $req('.chapter__text', c));
    const images = chapters.map((c) => $req('img', c));

    // The stage choreographs these itself; take them out of the global scroll reveals.
    for (const el of [...arts, ...texts]) el.removeAttribute('data-reveal');
    gsap.set(chapters, { zIndex: (i: number) => i + 1 });
    gsap.set(arts.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set(texts.slice(1), { opacity: 0, y: 40 });

    // Dots follow the timeline itself (not scroll events), so they stay in sync while scrub catches up.
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onUpdate: () => setCurrent(currentChapter(tl)),
    });
    tl.addLabel('ch0', 0).fromTo(images[0]!, { scale: 1.12 }, { scale: 1, duration: STEP, ease: 'none' }, 0);

    chapters.forEach((_, i) => {
      if (i === 0) return;
      const at = (i - 1) * STEP + 1; // each chapter holds ~1 unit before the next wipe
      tl.to(texts[i - 1]!, { opacity: 0, y: -40, duration: 0.4 }, at)
        .to(arts[i]!, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, at)
        .fromTo(images[i]!, { scale: 1.3 }, { scale: 1, duration: STEP + 0.6, ease: 'power1.out' }, at)
        .to(texts[i]!, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, at + 0.6)
        .addLabel(`ch${i}`, at + 1.1);
    });
    tl.to({}, { duration: 1 }); // a final pause on the last tapestry before unpinning

    const st = ScrollTrigger.create({
      animation: tl,
      trigger: stage,
      start: 'top top',
      end: () => `+=${(chapters.length - 1) * window.innerHeight * 1.25}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    });

    function currentChapter(timeline: gsap.core.Timeline): number {
      const t = timeline.time();
      let current = 0;
      chapters.forEach((_, i) => {
        if (t >= (timeline.labels[`ch${i}`] ?? Infinity) - 0.5) current = i;
      });
      return current;
    }

    function setCurrent(index: number): void {
      dots.forEach((d, i) => {
        if (i === index) d.setAttribute('aria-current', 'step');
        else d.removeAttribute('aria-current');
      });
    }

    const onDot = (e: Event) => {
      const i = Number((e.currentTarget as HTMLElement).dataset['huntDot']);
      const label = tl.labels[`ch${i}`] ?? 0;
      const y = st.start + (label / tl.duration()) * (st.end - st.start);
      scrollToTarget(Math.ceil(y));
    };
    dots.forEach((d) => d.addEventListener('click', onDot));
    setCurrent(0);

    return () => {
      dots.forEach((d) => d.removeEventListener('click', onDot));
      root.classList.remove('is-staged');
      dotsNav.hidden = true;
    };
  });
}
