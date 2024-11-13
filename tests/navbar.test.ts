import { test, expect } from '@playwright/test';

const admin_login_email = "nick-testing-playwright@test.it"
const admin_login_pass = "123456"

test.beforeEach(async ({ page }) => {
    //Sign-in
    await page.goto('/');
    await page.fill('input#email', admin_login_email);
    await page.fill('input#password', admin_login_pass);
    await page.click('button:has-text("Login")');

    await page.waitForURL('**/profiles');
    await page.click('img:first-of-type');
});
test('should render the navbar with all key elements', async ({ page }) => {
    // Check if the logo is visible
    await expect(page.locator('img[alt="Logo"]')).toBeVisible();
    
    // Check if the "Home" and "Playlist" navigation items are visible
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Playlist')).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should toggle the account menu on click', async ({ page }) => {
    // Click on the account menu button
    const accountIcon= await page.locator(`img[alt="/images/user/default-green.png"]`).first();
    await accountIcon.click();
    await expect(page.locator('div[data-testid="account-menu"]')).toBeVisible();

    // Click again to close the account menu
    await await accountIcon.click();
    await expect(page.locator('div[data-testid="account-menu"]')).not.toBeVisible();
  });
