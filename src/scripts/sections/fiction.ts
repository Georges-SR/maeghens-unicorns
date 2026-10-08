/**
 * Fiction filters. GSAP Flip records where every book is, applies the filter, then animates
 * books from their old positions to the new ones; leaving books shrink away, new ones grow in.
 */
import { $$ } from '@/scripts/core/dom';
import { prefersReducedMotion } from '@/scripts/core/env';
import { Flip, gsap, ScrollTrigger } from '@/scripts/core/motion';

export function initFiction(root: HTMLElement): void {
  const chips = $$<HTMLButtonElement>('[data-filter]', root);
  const books = $$('.book', root);

  function apply(kind: string): void {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset['filter'] === kind)));
    // Filtering takes over from the scroll reveal: make sure every book starts visible.
    gsap.set(books, { opacity: 1, y: 0 });
    const state = Flip.getState(books);
    for (const book of books)
      book.classList.toggle('is-hidden', kind !== 'all' && book.dataset['kind'] !== kind);

    if (prefersReducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }
    Flip.from(state, {
      duration: 0.75,
      ease: 'power3.inOut',
      stagger: 0.025,
      absolute: true,
      onEnter: (els) =>
        gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, y: 0, duration: 0.6 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.35 }),
      // The page got shorter or taller: re-measure every scroll-driven animation below.
      onComplete: () => ScrollTrigger.refresh(),
    });
  }

  chips.forEach((chip) => chip.addEventListener('click', () => apply(chip.dataset['filter'] ?? 'all')));
}
