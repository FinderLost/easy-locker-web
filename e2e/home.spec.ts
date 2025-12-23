import { test, expect, Page } from '@playwright/test';

const ES_HERO_TITLE = 'Consignas de equipaje en Córdoba | Easy Locker';
const EN_HERO_TITLE = 'Luggage storage in Córdoba | Easy Locker';

async function acceptCookies(page: Page): Promise<void> {
  const essentialButton = page.getByRole('button', {
    name: /aceptar solo esenciales|accept essentials only/i,
  });

  if (await essentialButton.isVisible({ timeout: 1_000 }).catch(() => false)) {
    await essentialButton.click();
  }
}

test.describe('Home UI smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('language', 'es');
      localStorage.removeItem('theme-preference');
    });
    await page.goto('/');
    await acceptCookies(page);
  });

  test('renders hero heading and CTAs', async ({ page }) => {
    await expect(page.getByTestId('hero-heading')).toHaveText(ES_HERO_TITLE);
    await expect(page.getByTestId('hero-cta-reserve')).toBeVisible();
    await expect(page.getByTestId('hero-cta-directions')).toBeVisible();
  });

  test('language switcher changes copy', async ({ page }) => {
    await expect(page.getByTestId('hero-heading')).toHaveText(ES_HERO_TITLE);

    await page.getByTestId('language-switcher-toggle').click();
    await page.getByTestId('language-option-en').click();

    await expect(page.getByTestId('hero-heading')).toHaveText(EN_HERO_TITLE);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('theme selector toggles dark mode', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);

    await page.getByTestId('theme-toggle').click();
    await page.getByTestId('theme-option-dark').click();
    await expect(html).toHaveClass(/dark/);

    await page.getByTestId('theme-toggle').click();
    await page.getByTestId('theme-option-light').click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test('FAQ accordion expands and collapses', async ({ page }) => {
    const firstToggle = page.getByTestId('faq-toggle-0');
    const firstAnswer = page.getByTestId('faq-answer-0');

    await expect(firstToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(firstAnswer).toHaveAttribute('class', /max-h-0/);

    await firstToggle.click();
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(firstAnswer).toHaveAttribute('class', /max-h-96/);
  });
});
