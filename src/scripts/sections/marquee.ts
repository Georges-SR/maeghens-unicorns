/**
 * Endless name bands. Each row holds two identical sets; moving by exactly one set's width
 * and wrapping gives a seamless loop. Scroll velocity briefly boosts the speed and
 * scroll direction flips it.
 */
import { $$ } from '@/scripts/core/dom';
import { prefersReducedMotion } from '@/scripts/core/env';
import { gsap, ScrollTrigger } from '@/scripts/core/motion';

const BASE_SPEED = 40; // px per second

export function initMarquee(root: HTMLElement): void {
  if (prefersReducedMotion()) return;

  const rows = $$('[data-marquee-row]', root).map((el) => ({
    el,
    dir: Number(el.dataset['marqueeRow']) || 1,
    x: 0,
  }));
  let boost = 0;
  let direction = 1;
  let visible = false;

  ScrollTrigger.create({
    trigger: root,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (visible = self.isActive),
    onUpdate: (self) => {
      direction = self.direction;
      boost = Math.min(12, Math.abs(self.getVelocity()) / 250);
    },
  });

  gsap.ticker.add((_time, deltaMs) => {
    if (!visible) return;
    boost *= 0.94; // decay back to cruising speed
    for (const row of rows) {
      const setWidth = row.el.scrollWidth / 2;
      row.x -= ((BASE_SPEED * (1 + boost) * deltaMs) / 1000) * row.dir * direction;
      row.x = gsap.utils.wrap(-setWidth, 0, row.x);
      gsap.set(row.el, { x: row.x });
    }
  });
}
