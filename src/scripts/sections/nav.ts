/**
 * Navigation bar behaviour:
 *  - gilt progress hairline tracks page scroll,
 *  - the bar gains a glass background once you leave the top,
 *  - it slides away while scrolling down and returns when scrolling up,
 *  - the link for the section in view is highlighted.
 */
import { $, $$, $req } from '@/scripts/core/dom';
import { prefersReducedMotion } from '@/scripts/core/env';
import { gsap, ScrollTrigger } from '@/scripts/core/motion';

export function initNav(): void {
  const nav = $req('[data-nav]');
  const bar = $req('.progress__bar');
  const setProgress = gsap.quickSetter(bar, 'scaleX');
  const reduced = prefersReducedMotion();

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      setProgress(self.progress);
      nav.classList.toggle('is-scrolled', self.scroll() > 40);
      if (reduced) return;
      const hide = self.direction === 1 && self.scroll() > window.innerHeight * 0.8;
      gsap.to(nav, { yPercent: hide ? -110 : 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
    },
  });

  // Highlight the link of the section currently crossing the middle of the screen.
  // Created on DOMContentLoaded so pinned sections already have their spacing.
  document.addEventListener('DOMContentLoaded', () => {
    for (const link of $$<HTMLAnchorElement>('[data-nav-link]')) {
      const target = $(`#${link.dataset['navLink']}`);
      if (!target) continue;
      ScrollTrigger.create({
        trigger: target,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => link.classList.toggle('is-active', self.isActive),
      });
    }
  });
}
