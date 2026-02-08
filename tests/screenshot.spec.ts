import { test } from '@playwright/test';

test('takes a screenshot of the home page', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.screenshot({ path: 'free_results_snapshot.png' });
});
