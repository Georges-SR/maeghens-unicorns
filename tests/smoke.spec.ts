import { expect, test, type ConsoleMessage, type Page } from '@playwright/test';

/** Console noise from headless GPU emulation that says nothing about the site. */
const IGNORED = [/GPU stall/i, /WebGL/i, /swiftshader/i, /Automatic fallback to software/i];

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error' && !IGNORED.some((re) => re.test(m.text()))) errors.push(m.text());
  });
  return errors;
}

test.describe('Maeghen’s Unicorns', () => {
  test('loads cleanly with every section and working nav anchors', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('./');
    await expect(page).toHaveTitle(/Maeghen’s Unicorns/);
    await expect(page.locator('h1')).toContainText('Unicorns');

    for (const id of ['origins', 'hunt', 'cultures', 'tapestry', 'gallery', 'fiction', 'oracle']) {
      await expect(page.locator(`#${id}`), `section #${id}`).toHaveCount(1);
    }
    const anchors = await page
      .locator('[data-nav-link]')
      .evaluateAll((links) => links.map((a) => (a as HTMLAnchorElement).hash));
    for (const hash of anchors) await expect(page.locator(hash)).toHaveCount(1);

    await page.waitForFunction(() => document.documentElement.dataset['ready'] === 'true');
    expect(errors).toEqual([]);
  });

  test('every image has alt text and no request fails', async ({ page }) => {
    const failed: string[] = [];
    page.on('requestfailed', (r) => failed.push(r.url()));
    await page.goto('./');
    const missingAlt = await page.locator('img:not([alt])').count();
    expect(missingAlt).toBe(0);
    await page.waitForLoadState('networkidle');
    expect(failed).toEqual([]);
  });

  test('the Oracle flips to a verdict and keeps score', async ({ page }) => {
    await page.goto('./#oracle');
    const oracle = page.locator('[data-oracle]');
    await oracle.getByRole('button', { name: 'Truth' }).click();
    await expect(oracle.locator('[data-oracle-verdict]')).toHaveText(/Truth — well read\./);
    await expect(oracle.locator('[data-oracle-score]')).toHaveText('Score 1');
    await oracle.locator('[data-oracle-next]').click();
    await expect(oracle.locator('[data-oracle-count]')).toHaveText('2 / 8');
  });

  test('fiction filters show only the chosen kind', async ({ page }) => {
    await page.goto('./#fiction');
    const fiction = page.locator('[data-fiction]');
    await fiction.getByRole('button', { name: 'Screen' }).click();
    await expect(fiction.getByRole('button', { name: 'Screen' })).toHaveAttribute('aria-pressed', 'true');
    await expect(fiction.locator('.book:not(.is-hidden)')).toHaveCount(5);
    await expect(fiction.locator('.book:not(.is-hidden)[data-kind="screen"]')).toHaveCount(5);
  });

  test('tapestry hotspots explain their detail', async ({ page }) => {
    await page.goto('./#tapestry');
    const reader = page.locator('[data-reader]');
    await reader.getByRole('button', { name: /The red stains/ }).click();
    await expect(reader.locator('[data-entry="stains"]')).toBeVisible();
    await expect(reader.getByRole('button', { name: /The red stains/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('gallery opens a zoomable lightbox', async ({ page }) => {
    await page.goto('./#gallery');
    await page.locator('.tile__link').first().click();
    await expect(page.locator('.pswp')).toBeVisible();
    await expect(page.locator('.pswp__caption')).toContainText('À mon seul désir');
    // Close requests are ignored during the opening zoom; wait until it has settled.
    await expect(page.locator('.pswp')).toHaveAttribute('data-ready', '');
    await page.locator('.pswp').getByRole('button', { name: 'Close' }).click();
    await expect(page.locator('.pswp')).toHaveCount(0);
  });
});

test.describe('origins timeline (desktop)', () => {
  /** Scroll to a fraction of the pinned timeline and return the last card's box. */
  async function lastCardAt(page: Page, fraction: number) {
    const range = await page.evaluate(() => {
      const spacer = document.querySelector('[data-timeline]')!.parentElement!;
      const top = spacer.getBoundingClientRect().top + scrollY;
      return { top, length: spacer.offsetHeight - innerHeight };
    });
    await page.evaluate((y) => window.scrollTo(0, y), range.top + range.length * fraction);
    await page.waitForTimeout(1500); // let the scrub catch up
    return page.locator('[data-timeline-track] > li').last().boundingBox();
  }

  for (const inflated of [false, true]) {
    test(`travel ends on the last card${inflated ? ' even if the track is inflated' : ''}`, async ({
      page,
    }, info) => {
      test.skip(info.project.name !== 'desktop', 'desktop layout only');
      await page.goto('./');
      await page.waitForFunction(() => document.documentElement.dataset['ready'] === 'true');
      if (inflated) {
        // Simulate engines that size the max-content track from unwrapped text.
        await page.addStyleTag({ content: '[data-timeline-track] { width: 20000px !important; }' });
        await page.evaluate(() => window.dispatchEvent(new Event('resize')));
        await page.waitForTimeout(500);
      }
      const viewport = page.viewportSize()!;

      // Half-way through, the last card is still to come…
      const mid = await lastCardAt(page, 0.5);
      expect(mid!.x).toBeGreaterThan(viewport.width);

      // …and at the end it rests fully on screen, not scrolled away into empty space.
      const end = await lastCardAt(page, 1);
      expect(end!.x).toBeGreaterThan(0);
      expect(end!.x + end!.width).toBeLessThanOrEqual(viewport.width);
    });
  }
});

test.describe('reduced motion', () => {
  test('shows all content without staging or pinning', async ({ page }, info) => {
    test.skip(info.project.name !== 'reduced-motion', 'reduced-motion project only');
    await page.goto('./');
    await expect(page.locator('[data-hunt]')).not.toHaveClass(/is-staged/);
    await expect(page.locator('[data-timeline]')).not.toHaveClass(/is-horizontal/);
    await page.locator('#fiction').scrollIntoViewIfNeeded();
    const hidden = await page
      .locator('[data-reveal]')
      .evaluateAll((els) => els.filter((el) => getComputedStyle(el).opacity !== '1').length);
    expect(hidden).toBe(0);
  });
});
