/**
 * Pointer-driven flourishes for mouse and trackpad users (skipped on touch and reduced motion):
 *
 *   data-magnetic   the element leans toward the cursor and springs back
 *   data-tilt       a card tilts in 3D and a highlight follows the cursor (--mx / --my)
 */
import { $$ } from '@/scripts/core/dom';
import { hasFinePointer, prefersReducedMotion } from '@/scripts/core/env';
import { gsap } from '@/scripts/core/motion';

const enabled = () => hasFinePointer() && !prefersReducedMotion();

export function initMagnetic(strength = 0.35): void {
  if (!enabled()) return;
  for (const el of $$('[data-magnetic]')) {
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' });
    });
  }
}

export function initTilt(maxDeg = 8): void {
  if (!enabled()) return;
  for (const el of $$('[data-tilt]')) {
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * maxDeg * 2);
      rx((0.5 - py) * maxDeg * 2);
      el.style.setProperty('--mx', `${px * 100}%`);
      el.style.setProperty('--my', `${py * 100}%`);
    });
    el.addEventListener('pointerleave', () => {
      rx(0);
      ry(0);
    });
  }
}
