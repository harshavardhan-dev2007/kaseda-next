import { test, expect } from '@playwright/test';

test.describe('KASEDA Landing Page E2E', () => {
  
  test('should load the page and render core elements', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/KASEDA/i);

    // Check header logo text
    const headerLogo = page.locator('header img[alt="KASEDA Logo"]');
    await expect(headerLogo).toBeVisible();

    // Verify main CTA is visible
    const ctaButton = page.locator('button', { hasText: 'Join The Founding Community' });
    await expect(ctaButton).toBeVisible();
  });

  test('should mock registration API and submit form successfully', async ({ page }) => {
    // Intercept the API call to prevent actual Google Sheets submission
    await page.route('/api/register', async route => {
      const json = { success: true, message: "Mock registration successful" };
      await route.fulfill({ json });
    });

    await page.goto('/');

    // Scroll down to the form
    await page.locator('h3', { hasText: 'Request Early Access' }).scrollIntoViewIfNeeded();

    // Fill out the form
    await page.fill('input#fullName', 'E2E Test User');
    await page.fill('input#whatsappNumber', '+919876543210');
    await page.fill('input#email', 'e2e@example.com');

    // Click submit
    await page.click('button:has-text("Reserve My Secret Launch Coupon")');

    // Because the form routes to /success on successful submission, check for the URL change
    await page.waitForURL('/success');
    expect(page.url()).toContain('/success');
  });
});
