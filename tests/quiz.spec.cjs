const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { pathToFileURL } = require('node:url');
const path = require('node:path');
async function complete(page) {
  for (let i = 0; i < 6; i++) {
    await page.getByRole('radio').nth(i % 4).check();
    await page.getByRole('button', { name: i === 5 ? 'See my match' : 'Continue' }).click();
  }
}
async function accessible(page) {
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
}
test('unsure answers allow exploring jobs, editing into a match and resetting', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start the quiz' }).click();
  for (let i = 0; i < 6; i++) {
    await page.getByRole('radio', { name: 'Not sure yet' }).check();
    await page.getByRole('button', { name: i === 5 ? 'See my match' : 'Continue' }).click();
  }
  await expect(page.getByRole('heading', { name: 'Explore tech jobs' })).toBeFocused();
  await expect(page.locator('.alternatives li')).toHaveCount(8);
  await expect(page.getByRole('heading', { name: 'Why this could suit you' })).toHaveCount(0);
  await accessible(page);
  await page.getByRole('button', { name: 'Change my answers' }).click();
  await expect(page.getByRole('radio', { name: 'Not sure yet' })).toBeChecked();
  await page.getByRole('radio').first().check();
  for (let i = 0; i < 6; i++) {
    await page.getByRole('button', { name: i === 5 ? 'See my match' : 'Continue' }).click();
  }
  await expect(page.getByRole('heading', { name: 'User researcher', exact: true })).toBeVisible();
  await expect(page.locator('.alternatives li')).toHaveCount(1);
  await expect(page.locator('.alternatives')).toContainText('UX designer');
  await accessible(page);
  await page.getByRole('button', { name: 'Change my answers' }).click();
  await page.getByRole('radio', { name: 'Not sure yet' }).check();
  for (let i = 0; i < 6; i++) {
    await page.getByRole('button', { name: i === 5 ? 'See my match' : 'Continue' }).click();
  }
  await expect(page.getByRole('heading', { name: 'Explore tech jobs' })).toBeVisible();
  await page.getByRole('button', { name: 'Finish' }).click();
  await page.getByRole('button', { name: 'Start the quiz' }).click();
  await expect(page.locator('input:checked')).toHaveCount(0);
});
test('quiz validates, preserves edits, explains results and clears for the next pupil', async ({ page }) => {
  await page.goto('/WhichTechJobAreYou/');
  await accessible(page);
  await page.getByRole('button', { name: 'Start the quiz' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await accessible(page);
  await page.getByRole('radio').nth(2).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.getByRole('radio').nth(2)).toBeChecked();
  await complete(page);
  await expect(page.getByRole('heading', { name: 'Why this could suit you' })).toBeVisible();
  await expect(page.locator('.alternatives li')).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'National Careers Service' })).toHaveAttribute('href', 'https://nationalcareers.service.gov.uk/explore-careers');
  await accessible(page);
  await page.getByRole('button', { name: 'Change my answers' }).click();
  await expect(page.getByRole('radio').first()).toBeChecked();
  await page.getByRole('button', { name: 'Start again' }).click();
  await page.getByRole('button', { name: 'Start the quiz' }).click();
  await complete(page);
  await page.getByRole('button', { name: 'Finish' }).click();
  await page.getByRole('button', { name: 'Start the quiz' }).click();
  await expect(page.locator('input:checked')).toHaveCount(0);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookie: document.cookie }))).toEqual({ local: 0, session: 0, cookie: '' });
});
test('cached project site reloads and finishes without a connection', async ({ page, context }) => {
  await page.goto('/WhichTechJobAreYou/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('button', { name: 'Start the quiz' }).click();
  await complete(page);
  await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();
});
test('downloaded site works directly from disk with no server', async ({ page }) => {
  await page.goto(pathToFileURL(path.resolve('site/index.html')).href);
  await page.getByRole('button', { name: 'Start the quiz' }).click();
  await complete(page);
  await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();
});
test('keyboard users can complete the quiz', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start the quiz' }).focus();
  await page.keyboard.press('Enter');
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await expect(page.getByRole('radio').first()).toBeChecked();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
  }
  await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();
});
test('touch layout fits a narrow screen', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173');
  await page.getByRole('button', { name: 'Start the quiz' }).tap();
  await page.locator('.answer').first().tap();
  await expect(page.getByRole('radio').first()).toBeChecked();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await accessible(page);
  await complete(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await accessible(page);
  await context.close();
});
test('main actions fit a landscape laptop screen', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Start the quiz' })).toBeInViewport({ ratio: 1 });
  await page.getByRole('button', { name: 'Start the quiz' }).click();
  for (let i = 0; i < 6; i++) {
    const next = page.getByRole('button', { name: i === 5 ? 'See my match' : 'Continue' });
    await expect(next).toBeInViewport({ ratio: 1 });
    await page.getByRole('radio').nth(i % 4).check();
    await next.click();
  }
  await expect(page.getByRole('button', { name: 'Finish' })).toBeInViewport({ ratio: 1 });
});
