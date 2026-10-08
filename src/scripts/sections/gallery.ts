/**
 * Gallery lightbox (PhotoSwipe): zoom/pinch, swipe, keyboard, and a caption taken from each
 * tile's <figcaption>. The PhotoSwipe core is only downloaded when someone opens an image.
 */
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { pauseScroll } from '@/scripts/core/smooth-scroll';

export function initGallery(root: HTMLElement): void {
  const lightbox = new PhotoSwipeLightbox({
    gallery: root,
    children: 'a[data-pswp-width]',
    pswpModule: () => import('photoswipe'),
    bgOpacity: 0.95,
    showHideAnimationType: 'zoom',
    padding: { top: 40, bottom: 110, left: 24, right: 24 },
    wheelToZoom: true,
  });

  lightbox.on('uiRegister', () => {
    lightbox.pswp?.ui?.registerElement({
      name: 'caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      onInit: (el, pswp) => {
        pswp.on('change', () => {
          const caption = pswp.currSlide?.data.element?.closest('figure')?.querySelector('figcaption');
          el.innerHTML = caption?.innerHTML ?? '';
        });
      },
    });
  });

  // Mark the viewer ready once the opening zoom settles: the caption fades in then
  // (see Gallery.astro), and close requests are only honoured from this point on.
  lightbox.on('openingAnimationEnd', () => lightbox.pswp?.element?.setAttribute('data-ready', ''));

  // Lenis would otherwise keep scrolling the page behind the lightbox.
  lightbox.on('beforeOpen', () => pauseScroll(true));
  lightbox.on('destroy', () => pauseScroll(false));

  lightbox.init();
}
