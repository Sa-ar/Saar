import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/** Match breakpoints used in [src/layouts/Layout.astro](src/layouts/Layout.astro) */
const VIEWPORT_WIDTHS = [390, 480, 600, 700, 820, 900, 1000, 1200] as const;
const VIEWPORT_HEIGHT = 900;

const ROUTES = [
  '/',
  '/work/bottom-sheet',
  '/work/monday-nested-blocks',
  '/work/healthy-io-marketing',
] as const;

async function assertNoA11yViolations(page: import('@playwright/test').Page, label: string) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations, `${label}: ${JSON.stringify(results.violations, null, 2)}`).toEqual([]);
}

async function assertNoHorizontalOverflow(page: import('@playwright/test').Page) {
  const overflow = await page.evaluate(() => {
    const el = document.documentElement;
    return el.scrollWidth - el.clientWidth;
  });
  expect(overflow, 'document should not scroll horizontally').toBeLessThanOrEqual(1);
}

test.describe('accessibility + responsive invariants', () => {
  for (const route of ROUTES) {
    test.describe(route, () => {
      for (const width of VIEWPORT_WIDTHS) {
        test(`axe + overflow @ ${width}px`, async ({ page }) => {
          await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
          await page.goto(route, { waitUntil: 'load' });
          await assertNoHorizontalOverflow(page);
          await assertNoA11yViolations(page, `${route} ${width}px`);
        });
      }
    });
  }

  test('home: mobile nav open then axe', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: VIEWPORT_HEIGHT });
    await page.goto('/', { waitUntil: 'load' });
    const hamburger = page.locator('#nav-hamburger');
    await expect(hamburger).toBeVisible();
    await expect(page.locator('.nav-links--desktop')).not.toBeVisible();
    await hamburger.click();
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#nav-mobile-menu')).toHaveAttribute('data-open', 'true');
    await assertNoA11yViolations(page, 'home mobile menu open');
    await hamburger.click();
  });

  test('home: work section navigates to bottom sheet case study', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: VIEWPORT_HEIGHT });
    await page.goto('/', { waitUntil: 'load' });
    await page.locator('#experience a.case-study-inline-link[href="/work/bottom-sheet"]').click();
    await expect(page).toHaveURL(/\/work\/bottom-sheet\/?$/);
    await expect(page.locator('h1.case-h1')).toBeVisible();
  });

  test('home: work section case study link navigates', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: VIEWPORT_HEIGHT });
    await page.goto('/', { waitUntil: 'load' });
    await page.locator('#experience a.case-study-inline-link[href="/work/monday-nested-blocks"]').click();
    await expect(page).toHaveURL(/\/work\/monday-nested-blocks\/?$/);
    await expect(page.locator('h1.case-h1')).toBeVisible();
  });

  test('home: hero terminal command then axe', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: VIEWPORT_HEIGHT });
    await page.goto('/', { waitUntil: 'load' });
    const input = page.locator('#hero-terminal-input');
    await input.fill('help');
    await input.press('Enter');
    await expect(page.locator('.hero-terminal-transcript')).toContainText('help');
    await assertNoA11yViolations(page, 'home after help command');
  });
});
