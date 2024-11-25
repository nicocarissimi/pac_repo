import { test, expect } from '@playwright/test';
import prismadb from '@/libs/prismadb'

const user_login_email = "nick-testing-db@test.it"
const user_login_pass = "nick1234"

const user_new_name = "NickTest"
const user_new_email = "nick-testing-playwright+1@test.it"
const user_new_pass = "123456"

test('get redirected', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Sign in')).toBeVisible();
});

test('Successfull sign-in', async ({ page }) => {
  await page.goto('http://localhost:3000/auth');
  await page.fill('input#email', user_login_email);
  await page.fill('input#password', user_login_pass);

  // Click the login button
  await page.click('button:has-text("Login")');

  // Verify that the profile page has some element to assert successful login
  await expect(page).toHaveURL('http://localhost:3000/profiles');
});

test('should register a new user and login', async ({ page }) => {
  await page.goto('http://localhost:3000/auth');
  // Switch to the registration form
  await page.click('span:has-text("Create an account")');

  // Fill the registration form
  await page.fill('input#name', user_new_name);
  await page.fill('input#email', user_new_email);
  await page.fill('input#password', user_new_pass);

  // Click the sign-up button
  await page.click('button:has-text("Sign up")');

  // Expect navigation to the profiles page after successful registration and login
  await page.waitForURL('**/preferences');

  // Verify that the profile page has some element to assert successful login
  await expect(page).toHaveURL('http://localhost:3000/preferences');
});

test('should redirect to google', async ({ page }) => {
  await page.goto('http://localhost:3000/auth');
  // Click the sign-up button
  await page.getByTestId('googleIcon').click();
  // Verify that the profile page has some element to assert successful login
  await expect(page).toHaveURL(/https:\/\/accounts\.google\.com/);
});
test('should redirect to github', async ({ page }) => {
  await page.goto('http://localhost:3000/auth');
  // Click the sign-up button
  await page.getByTestId('githubIcon').click();
  // Verify that the profile page has some element to assert successful login
  await expect(page).toHaveURL(/https:\/\/github\.com/);
});
test('should return validation errors in login', async ({ page }) => {
  await page.goto('http://localhost:3000/auth');
  // Switch to the registration form
  await page.click('span:has-text("Create an account")');

  // Fill the registration form
  await page.fill('input#name', 'a');
  await page.fill('input#email', '');
  await page.fill('input#password', '');

  // Click the sign-up button
  await page.click('button:has-text("Sign up")');
  const nameError = await page.locator('text=Name is required');
  const emailError = await page.locator('text=Invalid email address');
  const passwordError = await page.locator('text=Password must be at least 6 characters');

  // Validate that errors are displayed
  await expect(nameError).toBeVisible();
  await expect(emailError).toBeVisible();
  await expect(passwordError).toBeVisible();
});
test.afterAll(async () => {
  try {
    // Deleting user from database using Prisma
    await prismadb.user.delete({
      where: {
        email: user_new_email,
      },
    });
    console.log('Test user removed successfully from database');
  } catch (error) {
    console.error('Failed to remove test user:', error);
  }
  
});
