/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis share one clock.
 * Disabled entirely for people who prefer reduced motion (native scrolling instead).
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { prefersReducedMotion } from './env';
import { gsap, ScrollTrigger } from './motion';

let lenis: Lenis | null = null;

export function initSmoothScroll(): Lenis | null {
  if (lenis || prefersReducedMotion()) return lenis;

  lenis = new Lenis({
    lerp: 0.09,
    smoothWheel: true,
    anchors: { offset: 0 },
    // Let elements that scroll on their own (e.g. the mobile timeline) keep native scrolling.
    prevent: (node) => node.hasAttribute('data-native-scroll'),
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/** Pause smooth scrolling while an overlay (e.g. the lightbox) owns the wheel. */
export function pauseScroll(paused: boolean): void {
  if (!lenis) return;
  if (paused) lenis.stop();
  else lenis.start();
}

/** Scroll to a y position, element or selector — smoothly when Lenis is active. */
export function scrollToTarget(target: number | string | HTMLElement): void {
  if (lenis) {
    lenis.scrollTo(target);
    return;
  }
  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior });
}
