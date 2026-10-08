# Maeghen's Unicorns

A field guide to the animal that never was — and never went away.

An animated, interactive single-page site about the unicorn: its origins in history, the
seven Unicorn Tapestries, its many forms across cultures, and its life in fiction.

**Live:** https://georges-sr.github.io/maeghens-unicorns/

## Stack

| Concern          | Choice                                                                              |
| ---------------- | ----------------------------------------------------------------------------------- |
| Site generator   | [Astro](https://astro.build) — static HTML, components, zero JS by default          |
| Language         | TypeScript (strictest)                                                              |
| Animation        | [GSAP](https://gsap.com) with ScrollTrigger, SplitText and Flip                     |
| Smooth scrolling | [Lenis](https://lenis.darkroom.engineering), synced to GSAP's ticker                |
| Hero sky         | [three.js](https://threejs.org) with custom GLSL (nebula, starfield, constellation) |
| Lightbox         | [PhotoSwipe](https://photoswipe.com) with deep zoom                                 |
| Images           | `astro:assets` → responsive AVIF + WebP from the masters in `src/assets/art`        |
| Fonts            | Cormorant Garamond & Inter, self-hosted via Fontsource                              |
| Quality          | Prettier, ESLint, `astro check`, Playwright smoke tests                             |
| Hosting          | GitHub Pages via GitHub Actions                                                     |

## Getting started

Requires Node 22.12+.

```sh
npm install
npm run dev          # http://localhost:4321/maeghens-unicorns/
```

| Script                    | What it does                                                            |
| ------------------------- | ----------------------------------------------------------------------- |
| `npm run dev`             | Dev server with hot reload                                              |
| `npm run build`           | Production build into `dist/`                                           |
| `npm run preview`         | Serve the production build                                              |
| `npm run check`           | Type-check `.astro` and `.ts` files                                     |
| `npm run lint` / `format` | ESLint / Prettier                                                       |
| `npm test`                | Playwright smoke tests against the production build (run `build` first) |
| `npm run verify`          | Everything CI runs, in order                                            |

The first `npm test` on a new machine may need `npm run test:install` to fetch Chromium
(locally the config reuses an installed Chrome).

## How the code is organised

```
src/
  content/        All text and data, typed. Edit copy here — never in components.
    types.ts        the content model
    artworks.ts     every image + credit (the footer credits are generated from it)
    site.ts         title, nav sections, hero & prologue copy
    timeline.ts  hunt.ts  cultures.ts  tapestry.ts  fiction.ts  oracle.ts
    constellation.ts  the Monoceros figure (shared by the SVG and the WebGL sky)
  components/
    sections/       one component per page section (markup + scoped CSS + its script)
    layout/         nav, footer, cursor canvas
    ui/             Button, SectionHeader, ArtPicture, Ornament
  layouts/BaseLayout.astro   <head>, fonts, global CSS, boot script
  pages/index.astro          the page: sections in reading order
  scripts/
    boot.ts         start-up order (see below)
    core/           motion.ts (GSAP + plugins), smooth-scroll.ts (Lenis), env.ts, dom.ts
    effects/        reusable behaviours switched on by data attributes
    sections/       one controller per interactive section
    sky/            three.js scene + shaders for the hero
  styles/          tokens.css (design tokens), base.css, typography.css
  assets/art/      image masters (≤2000px JPEG); optimised at build time
tests/             Playwright smoke tests
```

### Conventions

- **Content is data.** Components render `src/content/*`; fields typed `Html` allow inline
  `<em>`, `<cite>`, `<strong>` only.
- **Behaviour is opt-in via data attributes.** Shared effects live in `scripts/effects/`:

  | Attribute             | Effect                                                                    |
  | --------------------- | ------------------------------------------------------------------------- |
  | `data-reveal`         | fade + rise on scroll (`="manual"`: hidden, animated by a section script) |
  | `data-split`          | heading lines rise out of a mask (SplitText)                              |
  | `data-scrub-words`    | words light up as you scroll through                                      |
  | `data-parallax="0.2"` | element drifts on scroll (desktop only)                                   |
  | `data-parallax-img`   | image slides inside its frame                                             |
  | `data-magnetic`       | element leans toward the cursor                                           |
  | `data-tilt`           | card tilts in 3D with a following highlight                               |

- **Import GSAP from `@/scripts/core/motion`**, never from `gsap`, so plugins register once.
- **Motion is progressive.** The base CSS layout works without JavaScript and with
  `prefers-reduced-motion`; scripts add pinning, staging and WebGL on top. A safety timer in
  `BaseLayout.astro` reveals everything if scripts fail to start.
- **ScrollTrigger order.** Section scripts run in page order before `DOMContentLoaded`
  (creating pins), and global effects run on `DOMContentLoaded`, so every trigger is measured
  with the pins' spacing in place. Anything that changes page height afterwards (like the
  fiction filter) calls `ScrollTrigger.refresh()`.
- **Design tokens only.** Colours, fonts, spacing and z-layers come from `styles/tokens.css`.

### Adding a section

1. Add its copy to a new file in `src/content/`.
2. Create `src/components/sections/MySection.astro` (use `SectionHeader`, scoped styles).
3. If it is interactive, add `src/scripts/sections/my-section.ts` and call it from the
   component's `<script>`.
4. Add it to `src/pages/index.astro`, and to `sections` in `src/content/site.ts` for the nav.
5. Add a smoke test in `tests/smoke.spec.ts`.

### Adding an artwork

Put a ≤2000px JPEG in `src/assets/art/`, add an entry to `src/content/artworks.ts`
(with its source page and licence), and reference it by `id`. Only public-domain or CC0
works are used.

## Deployment

`.github/workflows/pages.yml` verifies every push and pull request, and deploys `main` to
GitHub Pages when everything is green. `astro.config.mjs` sets `base: '/maeghens-unicorns'`;
use `withBase()` from `src/lib/paths.ts` for any hand-written internal URL.

## Credits

All artworks are in the public domain or released under CC0 (The Metropolitan Museum of Art
Open Access, Musée de Cluny, Galleria Borghese, University of Aberdeen, Philadelphia Museum
of Art and others, via Wikimedia Commons). The complete list, with links to each source, is
in `src/content/artworks.ts` and in the site's footer.
