import { test, expect } from '@playwright/test';
import prismadb from '@/libs/prismadb'
import bcrypt from 'bcrypt';
import { Role } from '@/libs/definitions';

const user_new_name = "NickTest"
const user_new_email = "nick-testing-playwright@test.it"
const user_new_pass = "123456"

let categoryId = "";
let videoId = "";

async function createUser(){
    const categoryName = 'New Category';
    const hashedPassword = await bcrypt.hash(user_new_pass, 12);
    const newCategory = await prismadb.category.create({
        data: {
          name: categoryName,
        },
      });
  
      console.log('Category created successfully:', newCategory);
      categoryId = newCategory.id;
    const newUser = await prismadb.user.create({
        data: {
            name: user_new_name,
            email: user_new_email,
            hashedPassword,
            role: Role.USER
        }
    });
    
}
async function cleanData(){
    try{
        await prismadb.user.delete({
            where:{
                email: user_new_email
            }
        })
        await prismadb.category.delete({
            where:{
                id: categoryId
            }
        })
    }catch(error) {
        console.error('Failed to remove setupData:', error , "VideoId received:", videoId, " CategoryID:", categoryId);
      }
}

test.beforeAll(async()=>{
    await createUser();
})

test.afterAll(async()=>{
    await cleanData()
})
test.beforeEach(async ({ page }) => {
    // LOGIN
    await page.goto('http://localhost:3000/auth');
    await page.fill('input#email', user_new_email);
    await page.fill('input#password', user_new_pass);
    await page.click('button:has-text("Login")');
})
test("Should get redirected to preferences page", async ({ page }) =>{
    await expect(page.getByText('Welcome to').first()).toBeVisible();
    await expect(page.getByRole("button").last()).toBeEnabled()
})
test("Should work even if user wants to avoid preferences", async ({ page }) =>{
    await expect(page.getByText('Welcome to').first()).toBeVisible();
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveURL('http://localhost:3000/preferences');
})

test("Expect selection time to be visibile and to update on change",async ({ page }) =>{
    await expect(page.getByText('How long').first()).toBeVisible();
    const firstOption = await page.getByText('min').nth(1)
    await firstOption.click()
    const option1_text = await firstOption.innerText()
    const selection = page.getByText('min').first()
    await expect(selection).toHaveText(option1_text)

    const secondOption = await page.getByText('2h').first()
    await secondOption.click()
    const option2_text = await secondOption.innerText()
    const selection2 = page.getByText('2h').first()
    await expect(selection2).toHaveText(option2_text)
})

test("Drama Techniques after learning time selection",async ({ page }) =>{
    await expect(page.getByText('How long').first()).toBeVisible();
    await expect(page.getByText('Select the drama techniques')).not.toBeVisible()
    await page.getByRole("button").last().click()
    await expect(page.getByText('Select the drama techniques')).toBeVisible()
})

test("Drama Techniques mandatory selection",async ({ page }) =>{
    await expect(page.getByText('How long').first()).toBeVisible();
    await expect(page.getByText('Select the drama techniques')).not.toBeVisible();
    await page.getByRole("button").last().click();
    await expect(page.getByText('Select the drama techniques')).toBeVisible();
    
    await await expect(page.getByRole("button").last()).toBeDisabled();
    const option= await page.locator(`div:has(button[data-state="unchecked"])`).last().click();
    await expect(page.getByRole("button").last()).toBeEnabled();
    await page.locator(`div:has(button[data-state="checked"])`).last().click();
    await expect(page.getByRole("button").last()).toBeDisabled();
})

test("Full preference selection functionality",async ({ page }) =>{
    await expect(page.getByText('How long').first()).toBeVisible();
    await expect(page.getByText('Select the drama techniques')).not.toBeVisible()
    await page.getByRole("button").last().click()
    await expect(page.getByText('Select the drama techniques')).toBeVisible()
    
    await await expect(page.getByRole("button").last()).toBeDisabled()
    await page.locator(`div:has(button[data-state="unchecked"])`).last().click();
    page.getByRole("button").last().click()
    await expect(page).toHaveURL('http://localhost:3000/');
})