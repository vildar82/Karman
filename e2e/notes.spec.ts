import { expect, test } from '@playwright/test';

test.use({ locale: 'en-US' });

test('shows the empty notes screen in the browser language', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'My notes', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'No notes yet' })).toBeVisible();
  await expect(page.getByText('0 notes', { exact: true })).toBeVisible();
  await expect(page.getByText('Create your first note to save a thought, a drawing, or a diagram.')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test.describe('Russian browser', () => {
  test.use({ locale: 'ru-RU', viewport: { width: 390, height: 844 } });

  test('shows the Russian empty screen on a phone-sized viewport', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Мои заметки', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Пока нет заметок' })).toBeVisible();
    await expect(page.getByText('0 заметок', { exact: true })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});

test('uses an available Telegram language before the browser language', async ({ page }) => {
  await page.addInitScript(() => {
    window.Telegram = { WebApp: { initDataUnsafe: { user: { language_code: 'ru' } } } };
  });

  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Мои заметки', level: 1 })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page).toHaveTitle('Карман');
});