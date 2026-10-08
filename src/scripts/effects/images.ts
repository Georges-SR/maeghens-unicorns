/**
 * Lazy images inside pinned, transformed stages (the timeline track, the hunt) are only
 * discovered by the browser at the last moment. Switch them to eager loading shortly
 * before the stage arrives so every frame is ready when it slides into view.
 */
import { ScrollTrigger } from '@/scripts/core/motion';

/** Distance before the container's top at which its images start loading. */
const LEAD_PX = 1600;

export function primeImages(container: HTMLElement): void {
  ScrollTrigger.create({
    trigger: container,
    start: `top bottom+=${LEAD_PX}`,
    once: true,
    onEnter: () => {
      for (const img of container.querySelectorAll<HTMLImageElement>('img[loading="lazy"]'))
        img.loading = 'eager';
    },
  });
}
