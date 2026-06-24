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
    await page.waitForURL('**/success');
    expect(page.url()).toContain('/success');
  });

  test('should simulate API failure and verify error message appears', async ({ page }) => {
    // Intercept and mock a 500 error
    await page.route('/api/register', async route => {
      await route.fulfill({ 
        status: 500, 
        json: { error: "Simulated Internal Server Error" } 
      });
    });

    await page.goto('/');

    await page.locator('h3', { hasText: 'Request Early Access' }).scrollIntoViewIfNeeded();

    await page.fill('input#fullName', 'E2E Error User');
    await page.fill('input#whatsappNumber', '+919876543210');
    await page.fill('input#email', 'e2e-error@example.com');

    await page.click('button:has-text("Reserve My Secret Launch Coupon")');

    // Check that the error message is displayed
    const errorMessage = page.locator('text="Simulated Internal Server Error"');
    await expect(errorMessage).toBeVisible();
  });

  test('should verify Footer links', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Verify Instagram link
    const igLink = page.locator('footer a', { hasText: 'Instagram' });
    await expect(igLink).toBeVisible();
    await expect(igLink).toHaveAttribute('href', 'https://www.instagram.com/kaseda.in?igsh=MWFzZWVibWsxN2Fz');

    // Verify WhatsApp link
    const waLink = page.locator('footer a', { hasText: 'WhatsApp Business' });
    await expect(waLink).toBeVisible();
    await expect(waLink).toHaveAttribute('href', 'https://wa.me/917680956376');
  });
});
