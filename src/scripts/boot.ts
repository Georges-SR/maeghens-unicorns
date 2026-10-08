/**
 * Site-wide boot sequence, loaded once from the layout's <head>.
 *
 * Order matters for ScrollTrigger: pinned sections add scroll distance, so every trigger
 * below a pin must be measured after the pin exists. Section scripts (in each component)
 * run in page order before DOMContentLoaded; the global effects below wait for that event,
 * then everything is sorted and measured once.
 */
import { initSmoothScroll } from './core/smooth-scroll';
import { prefersReducedMotion } from './core/env';
import { ScrollTrigger } from './core/motion';
import { initParallax } from './effects/parallax';
import { initMagnetic, initTilt } from './effects/pointer';
import { initReveals, initScrubWords, initSplitHeadings } from './effects/reveal';

const root = document.documentElement;
root.classList.toggle('reduced-motion', prefersReducedMotion());

initSmoothScroll();

document.addEventListener('DOMContentLoaded', () => {
  initSplitHeadings();
  initScrubWords();
  initReveals();
  initParallax();
  initMagnetic();
  initTilt();

  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  // Tells the layout's safety timer that scripts are alive (see BaseLayout.astro).
  root.dataset['ready'] = 'true';
});

// Web fonts and lazy images change heights; re-measure once they settle.
void document.fonts.ready.then(() => ScrollTrigger.refresh());
addEventListener('load', () => ScrollTrigger.refresh());
