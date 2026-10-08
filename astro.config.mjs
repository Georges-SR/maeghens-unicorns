// @ts-check
import { defineConfig } from 'astro/config';

// The site is served from GitHub Pages at https://georges-sr.github.io/maeghens-unicorns/
// `base` must match the repository name; every internal URL goes through `import.meta.env.BASE_URL`.
export default defineConfig({
  site: 'https://georges-sr.github.io',
  base: '/maeghens-unicorns',
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    // Art is the heart of the site: generate generous breakpoints, let the browser choose.
    breakpoints: [480, 768, 1080, 1440, 2000],
  },
  vite: {
    build: {
      // three.js is loaded lazily in its own chunk; keep the warning meaningful for everything else.
      chunkSizeWarningLimit: 700,
    },
  },
});
