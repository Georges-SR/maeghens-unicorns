import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;
const BASE = `http://localhost:${PORT}/maeghens-unicorns/`;

/** Smoke tests run against the production build (`astro preview`), exactly what GitHub Pages serves. */
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: {
    baseURL: BASE,
    trace: 'on-first-retry',
    // Locally, reuse the installed Chrome instead of downloading Playwright's browser.
    ...(process.env['CI'] ? {} : { channel: 'chrome' }),
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    {
      name: 'reduced-motion',
      use: { ...devices['Desktop Chrome'], contextOptions: { reducedMotion: 'reduce' } },
    },
  ],
  webServer: {
    command: `npm run preview -- --port ${PORT}`,
    url: BASE,
    reuseExistingServer: !process.env['CI'],
    timeout: 60_000,
  },
});
