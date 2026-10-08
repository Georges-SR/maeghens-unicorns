/**
 * Origins timeline. On desktop with motion: pin the section and translate the track
 * horizontally as you scroll; images drift inside their frames, cards lift as they reach
 * centre, and a running year label and progress bar track your place in history.
 * Elsewhere the vertical rail (plain CSS + scroll reveals) is used.
 */
import { $$, $req } from '@/scripts/core/dom';
import { MM_CONDITIONS, type MMConditions } from '@/scripts/core/env';
import { gsap } from '@/scripts/core/motion';
import { primeImages } from '@/scripts/effects/images';

export function initTimeline(root: HTMLElement): void {
  const track = $req('[data-timeline-track]', root);
  const year = $req('[data-timeline-year]', root);
  const progress = $req('[data-timeline-progress]', root);
  const events = $$('.event', track);

  gsap.matchMedia().add(MM_CONDITIONS, (ctx) => {
    const { desktop, motion } = ctx.conditions as MMConditions;
    if (!desktop || !motion) return;

    root.classList.add('is-horizontal');
    primeImages(root);
    // Cards are revealed by the horizontal motion itself; take them out of the global reveals.
    for (const card of events) card.removeAttribute('data-reveal');
    // How far the track travels: until the last card's right edge rests at 70% of the screen.
    // Measured from the card itself (offsetLeft ignores transforms), never from scrollWidth,
    // which some engines inflate with invisible width (see Timeline.astro).
    const lastCard = events[events.length - 1]!;
    const distance = () => {
      const trackLeft = track.getBoundingClientRect().left - Number(gsap.getProperty(track, 'x'));
      const lastRight = trackLeft + lastCard.offsetLeft + lastCard.offsetWidth;
      return Math.max(0, lastRight - window.innerWidth * 0.7);
    };

    const scroller = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(progress, { scaleX: self.progress });
          const current = events[Math.round(self.progress * (events.length - 1))];
          const marker = current?.dataset['marker'];
          if (marker && year.textContent !== marker) {
            gsap.fromTo(year, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5 });
            year.textContent = marker;
          }
        },
      },
    });

    // Each card focuses as it passes through the centre of the screen.
    for (const card of events) {
      gsap.fromTo(
        card,
        { opacity: 0.35, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 1,
          scrollTrigger: {
            trigger: card,
            containerAnimation: scroller,
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        },
      );
      const img = card.querySelector('img');
      if (img) {
        gsap.fromTo(
          img,
          { xPercent: -8, scale: 1.18 },
          {
            xPercent: 8,
            scale: 1.18,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: scroller,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        );
      }
    }

    return () => root.classList.remove('is-horizontal');
  });
}
