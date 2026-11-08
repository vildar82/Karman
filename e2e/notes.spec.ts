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
    await page.getByRole('button', { name: 'Создать заметку' }).click();
    await expect(page.getByRole('radio', { name: 'Выделение области', exact: true })).toBeAttached();
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

test('creates a note, saves text, and opens it after reloading', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Create note' }).click();
  await page.locator('label').filter({ has: page.getByRole('radio', { name: 'Text', exact: true }) }).click();
  await page.locator('canvas.interactive').click({ position: { x: 250, y: 250 } });
  await page.locator('textarea').fill('A saved thought');
  await page.keyboard.press('Escape');
  await expect.poll(async () => page.evaluate(() => localStorage.getItem('karman.notes.v1'))).toContain('A saved thought');
  const elementId = await page.evaluate(() => JSON.parse(localStorage.getItem('karman.notes.v1')!)[0].document.elements[0].id);
  await page.reload();
  await page.getByRole('button', { name: 'Untitled note' }).click();
  await expect(page.locator('.excalidraw')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Undo' })).toBeDisabled();
  await page.locator('canvas.interactive').dblclick({ position: { x: 260, y: 260 } });
  await expect(page.locator('textarea')).toHaveValue('A saved thought');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Back to notes' }).click();
  await page.getByRole('button', { name: 'Untitled note' }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('karman.notes.v1')!)[0].document.elements[0].id)).toBe(elementId);
});