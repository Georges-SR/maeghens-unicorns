# Maeghen's Unicorns — development plan

A single-page, animated, interactive field guide to the unicorn: where the idea came from,
how cultures reshaped it, and where it lives in fiction today.

## Creative direction

**"Midnight tapestry."** Not pink, not candy, not glitter. The palette is taken from the
late-medieval unicorn tapestries — the world's most famous unicorn images — set against a
night sky. Tokens live in `src/styles/tokens.css`.

| Token        | Hex       | Use                             |
| ------------ | --------- | ------------------------------- |
| `--c-ink`    | `#070b14` | page background (midnight)      |
| `--c-forest` | `#0d1a17` | millefleur green-black panels   |
| `--c-ivory`  | `#efe6d2` | body text, the unicorn's coat   |
| `--c-gold`   | `#c9a45c` | gilt accents, horn, lines       |
| `--c-lapis`  | `#3a5b94` | cool accent, sky glow           |
| `--c-madder` | `#a2412f` | rare warm accent (tapestry red) |

Type: _Cormorant Garamond_ (display) + _Inter_ (UI). Texture: film grain, gilt hairlines.

## Page

| #   | Section         | Experience                                                                                                   |
| --- | --------------- | ------------------------------------------------------------------------------------------------------------ |
| —   | Hero            | three.js sky: shader nebula, 3D starfield parallax, Monoceros drawn in gold, shooting stars; SplitText title |
| —   | Prologue        | Rilke; a paragraph whose words light up as you scroll                                                        |
| I   | Origins         | pinned horizontal timeline, running year counter, cards focus at centre                                      |
| II  | The Hunt        | the seven Unicorn Tapestries as a pinned scroll story: curtain wipes, camera moves, chapter dots             |
| III | Cultures        | 3D tilt cards with a following highlight                                                                     |
| —   | Marquee         | the unicorn's names in many languages, speed reacts to scroll velocity                                       |
| IV  | Tapestry reader | hotspots; the tapestry zooms toward each detail                                                              |
| V   | Gallery         | build-time balanced masonry, columns drift at different speeds, PhotoSwipe deep zoom                         |
| VI  | Fiction         | filterable shelf animated with GSAP Flip                                                                     |
| VII | Oracle          | myth-or-truth quiz on a flipping card, gold spark bursts, final rank                                         |
| —   | Colophon        | dedication, generated image credits                                                                          |

## Engineering principles

- Astro static output, TypeScript strictest; content as typed data, separate from markup.
- Each section owns its markup, scoped CSS and controller; shared effects opt in via data
  attributes.
- Progressive motion: works without JS and with reduced motion; GSAP `matchMedia` swaps
  layouts per breakpoint and motion preference.
- Performance: three.js and the PhotoSwipe core load lazily; images are responsive AVIF/WebP;
  render loops pause off-screen.
- Quality gates in CI: Prettier, ESLint, `astro check`, build, Playwright (desktop, mobile,
  reduced motion). Only green `main` deploys.

## Milestones

- [x] M0 — folder, repo, public-domain art research
- [x] M1 — v1: static HTML/CSS/JS site, published to GitHub Pages
- [x] M2 — v2 architecture: Astro + TypeScript, content model, design tokens
- [x] M3 — v2 motion: GSAP/ScrollTrigger/SplitText/Flip, Lenis, three.js sky, PhotoSwipe
- [x] M4 — The Hunt (seven tapestries), marquee, tapestry lens, gallery parallax
- [x] M5 — tooling: lint, format, type-check, Playwright, CI/CD
- [ ] M6 — next ideas (below)

## Next ideas

- Ambient soundtrack toggle (lute / harp, public-domain recording)
- "Name your unicorn" generator with a shareable card
- French translation (content model is ready for it: one content folder per language)
- Lighthouse budget check in CI
