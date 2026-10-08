/**
 * Single entry point for GSAP. Import gsap and its plugins from here, never from 'gsap'
 * directly, so plugins are registered exactly once and defaults are shared.
 */
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

/** House eases: everything moves with the same soft, decelerating feel. */
export const EASE = {
  out: 'expo.out',
  inOut: 'power3.inOut',
  soft: 'power2.out',
} as const;

gsap.defaults({ ease: EASE.out, duration: 1.1 });

ScrollTrigger.config({ ignoreMobileResize: true });

export { Flip, gsap, ScrollTrigger, SplitText };
