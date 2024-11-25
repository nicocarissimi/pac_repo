import { test, expect } from '@playwright/test';
import prismadb from '@/libs/prismadb'
import bcrypt from 'bcrypt';
import { Role } from '@/libs/definitions';

const user_new_name = "NickTest"
const user_new_email = "nick-testing-playwright@test.it"
const user_new_pass = "123456"

const admin_login_email = "nick-testing-playwright@test.it"
const admin_login_pass = "123456"
async function setupData(){
  const hashedPassword = await bcrypt.hash(user_new_pass, 12);
  const newUser = await prismadb.user.create({
    data: {
        name: user_new_name,
        email: user_new_email,
        image: "/images/user/default-green.png",
        hashedPassword,
        role: Role.ADMIN,
    }
});
}

async function cleanUp(){
  const user = await prismadb.user.findUnique({
    where:{
        email: user_new_email
    }
  })
  await prismadb.user.delete({
    where:{
        id: user?.id
    }
})
}

test.beforeAll(async()=>{
  await setupData();
})

test.afterAll(async()=>{
  await cleanUp();
})
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
