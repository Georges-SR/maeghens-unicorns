/**
 * Scroll reveals, opted into from markup:
 *
 *   data-reveal            fade + rise when scrolled into view (batched, staggered)
 *   data-reveal="manual"   hidden by CSS but animated by its own section script
 *   data-split             heading lines rise out of a mask (GSAP SplitText)
 *   data-scrub-words       words light up one by one as you scroll through the paragraph
 */
import { $$ } from '@/scripts/core/dom';
import { prefersReducedMotion } from '@/scripts/core/env';
import { gsap, ScrollTrigger, SplitText } from '@/scripts/core/motion';

export function initReveals(): void {
  const items = $$('[data-reveal]:not([data-reveal="manual"])');
  if (prefersReducedMotion()) {
    gsap.set(items, { opacity: 1, y: 0 });
    return;
  }
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.3, stagger: 0.09, overwrite: true }),
  });
}

export function initSplitHeadings(): void {
  if (prefersReducedMotion()) return;
  for (const el of $$('[data-split]')) {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      // Returning the tween lets SplitText revert and rebuild it when lines re-wrap on resize.
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.4,
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }),
    });
  }
}

export function initScrubWords(): void {
  if (prefersReducedMotion()) return;
  for (const el of $$('[data-scrub-words]')) {
    const split = SplitText.create(el, { type: 'words' });
    gsap.fromTo(
      split.words,
      { opacity: 0.16 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 45%', scrub: true },
      },
    );
  }
}
