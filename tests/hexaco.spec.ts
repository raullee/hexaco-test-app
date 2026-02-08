import { test, expect } from '@playwright/test';

test('completes the HEXACO test and generates a PDF of the results', async ({ page }) => {
  // Wait for the dev server to start
  await page.waitForTimeout(15000);

  // Navigate to an external site to test connectivity
  await page.goto('https://www.google.com');

  // Navigate to the app
  await page.goto('http://localhost:5173/');

  // Start the test
  await page.getByRole('button', { name: 'Start Test' }).click();

  // Answer all 60 questions
  for (let i = 0; i < 60; i++) {
    // Wait for the question to be visible
    await expect(page.locator('.container h2')).toBeVisible();
    // Click a neutral answer to proceed quickly
    await page.getByRole('button', { name: 'Neutral' }).click();
  }

  // Wait for the results to be visible
  await expect(page.locator('h2')).toHaveText('Results');

  // Generate a PDF of the free results page
  await page.pdf({ path: 'free_results_snapshot.pdf' });

  // Optional: Add an assertion to verify the test is complete
  await expect(page.getByRole('button', { name: 'Restart Test' })).toBeVisible();
});
