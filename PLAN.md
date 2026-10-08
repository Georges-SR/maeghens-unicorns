# Maeghen's Unicorns — development plan

A single-page, animated, interactive field guide to the unicorn: where the idea came
from, how cultures reshaped it, and where it lives in fiction today.

## Creative direction

**"Midnight tapestry."** Not pink, not candy, not glitter. The palette is taken from the
late-medieval unicorn tapestries themselves — the world's most famous unicorn images —
set against a night sky:

| Token     | Hex       | Use                                  |
|-----------|-----------|--------------------------------------|
| ink       | `#070b14` | page background (midnight)           |
| forest    | `#0d1a17` | millefleur green-black panels        |
| ivory     | `#efe6d2` | body text, the unicorn's coat        |
| gold      | `#c9a45c` | gilt accents, horn, lines            |
| lapis     | `#3a5b94` | cool accent, links, sky glow         |
| madder    | `#a2412f` | rare warm accent (tapestry red)      |

Type: *Cormorant Garamond* (display, literary, engraved feel) + *Inter* (UI, labels).
Texture: subtle film grain, gilt hairlines, ornamental dividers.

## Sections

1. **Hero — the constellation.** A live starfield on canvas. A unicorn constellation
   draws itself line by line; stars react to the cursor, parallax with movement, and a
   click launches a shooting star. Gilded animated title.
2. **Prologue.** Rilke: *"O dieses ist das Tier, das es nicht gibt."*
3. **Origins timeline.** Pinned horizontal scroll on desktop (vertical on mobile):
   Indus seals → Ctesias → Aristotle → Pliny → Physiologus → Aberdeen Bestiary →
   the 1414 Ming "qilin" giraffe → the Tapestries → Raphael → Scotland's arms →
   Ole Worm & the narwhal → the Danish throne → the Siberian "unicorn".
4. **Across cultures.** 3D-tilt cards: Re'em, Karkadann, Qilin, Xiezhi, the Alicorn
   trade, the Scottish unicorn.
5. **Read the tapestry.** *The Unicorn in Captivity* with interactive hotspots that
   decode its symbols (horn, red stains, pomegranates, fence, chain, millefleur).
6. **Gallery.** Masonry of public-domain masterpieces with a zoomable lightbox.
7. **In fiction.** Filterable cards (Literature / Screen / Culture) from Lewis Carroll
   to Pixar.
8. **The Oracle.** "Myth or truth?" — an 8-question card quiz with flip reveals and a score.
9. **Colophon.** Credits, image licenses, dedication.

## Interaction & motion

- Canvas starfield + constellation (requestAnimationFrame, DPR-aware, pauses offscreen).
- Gold-dust cursor trail (desktop pointer only).
- IntersectionObserver reveal choreography; scroll progress hairline.
- Pinned horizontal timeline driven by scroll position.
- Card tilt with specular highlight; lightbox with keyboard navigation.
- All motion honors `prefers-reduced-motion`; everything works without JS (content is
  in the HTML).

## Tech & production

- Zero-build static site: semantic HTML, modern CSS, vanilla ES modules. No framework,
  nothing to break, instant loads.
- Images: public-domain / CC0 works from The Met Open Access and Wikimedia Commons,
  resized to ≤1400px WebP (~0.2–0.7 MB each), lazy-loaded.
- Hosting: GitHub Pages, deployed by a GitHub Actions workflow on every push to `main`.
- Accessibility: landmarks, alt text, focus states, keyboard-operable hotspots/quiz/lightbox,
  AA contrast on text.

## Milestones

- [x] M0 — folder, git repo, asset research & download
- [x] M1 — plan & design system
- [x] M2 — build all sections
- [x] M3 — polish: motion, responsive, a11y, performance (first pass)
- [x] M4 — publish to GitHub Pages — https://georges-sr.github.io/maeghens-unicorns/

## Later ideas

- Ambient soundtrack toggle (lute / harp, public-domain recording)
- "Name your unicorn" generator with shareable card
- WebGL iridescent horn in the hero
- French translation
