/**
 * Tapestry reader: hotspots and prev/next buttons select a detail; the tapestry zooms toward
 * it (a "lens") while the explanation crossfades. Hotspots counter-scale so they stay the
 * same size on screen when zoomed.
 */
import { $$, $req } from '@/scripts/core/dom';
import { prefersReducedMotion } from '@/scripts/core/env';
import { gsap } from '@/scripts/core/motion';

const ZOOM = 1.9;

export function initTapestryReader(root: HTMLElement): void {
  const lens = $req('[data-reader-lens]', root);
  const spots = $$<HTMLButtonElement>('[data-spot]', root);
  const entries = $$('[data-entry]', root);
  const reset = $req<HTMLButtonElement>('[data-reader-reset]', root);
  const order = spots.map((s) => s.dataset['spot'] ?? '');
  const reduced = prefersReducedMotion();
  let index = -1;

  function showEntry(id: string): void {
    const next = entries.find((e) => e.dataset['entry'] === id);
    const current = entries.find((e) => !e.hidden);
    if (!next || next === current) return;
    if (current) current.hidden = true;
    next.hidden = false;
    if (!reduced) gsap.from(next.children, { opacity: 0, y: 18, duration: 0.7, stagger: 0.06 });
  }

  function zoomTo(spot: HTMLElement | null): void {
    const x = spot ? parseFloat(spot.style.getPropertyValue('--x')) : 50;
    const y = spot ? parseFloat(spot.style.getPropertyValue('--y')) : 50;
    const scale = spot ? ZOOM : 1;
    // Translation is applied before scale, so a point d% from the centre lands at scale·d%.
    // Shift it back to the centre, but never so far that the frame shows an edge.
    const limit = (scale - 1) * 50;
    const shiftX = gsap.utils.clamp(-limit, limit, (50 - x) * scale);
    const shiftY = gsap.utils.clamp(-limit, limit, (50 - y) * scale);
    const duration = reduced ? 0 : 1.2;
    gsap.to(lens, { scale, xPercent: shiftX, yPercent: shiftY, duration, ease: 'power3.inOut' });
    gsap.to(spots, { scale: 1 / scale, duration, ease: 'power3.inOut' });
  }

  function select(i: number): void {
    index = i;
    const spot = spots[i] ?? null;
    spots.forEach((s, k) => s.setAttribute('aria-pressed', String(k === i)));
    showEntry(order[i] ?? 'intro');
    zoomTo(spot);
    reset.hidden = false;
  }

  function clear(): void {
    index = -1;
    spots.forEach((s) => s.setAttribute('aria-pressed', 'false'));
    showEntry('intro');
    zoomTo(null);
    reset.hidden = true;
  }

  spots.forEach((s, i) => s.addEventListener('click', () => (index === i ? clear() : select(i))));
  reset.addEventListener('click', clear);
  for (const btn of $$('[data-step]', root)) {
    btn.addEventListener('click', () => {
      const n = order.length;
      const step = Number(btn.dataset['step']);
      select(index < 0 ? (step > 0 ? 0 : n - 1) : (index + step + n) % n);
    });
  }
}
