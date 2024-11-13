import { test, expect } from '@playwright/test';
import prismadb from '@/libs/prismadb'
import bcrypt from 'bcrypt';
import { Role } from '@/libs/definitions';

const user_new_name = "NickTest"
const user_new_email = "nick-testing-playwright@test.it"
const user_new_pass = "123456"

const playlistName="playwright test Playlist"
const privatePlaylistName= playlistName+"-Private"
let categoryId = ''
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
            role: Role.USER,
        }
    });
    
    await prismadb.usersInCategories.create({
        data:{
            userId: newUser.id,
            categoryId
        }
    })
}
async function cleanData(){
    try{
        const user = await prismadb.user.findUnique({
            where:{
                email: user_new_email
            }
        })
        await prismadb.playlist.deleteMany({
            where:{
                owner:{
                    id: user?.id
                }
            }
        })
        await prismadb.user.delete({
            where:{
                id: user?.id
            }
        })
        await prismadb.category.delete({
            where:{
                id: categoryId
            }
        })
    }catch(error) {
        console.error('Failed to remove setupData:', error , "Email received:", user_new_email, " CategoryID:", categoryId);
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
    await expect(page).toHaveURL('/profiles');
    await page.goto('http://localhost:3000/playlist');
    
})
test("Playlist page",async ({ page }) =>{
    await expect(page).toHaveURL('/playlist');
})
test("should be able to add a new Playlist",async({page})=>{
    const addPlaylistButton = await page.locator(`svg:has(path[d="M12 4.5v15m7.5-7.5h-15"])`).first();
    await addPlaylistButton.click();
    await page.getByText("Enter a name for your new playlist and choose if it should be public or private.")
    await page.fill('input#name', playlistName);
    await page.getByRole("button").nth(1).click()
    await expect(page.getByText(playlistName)).toBeVisible()
})
test("should be able to see or not playlist in trending based on public or private flag",async({page})=>{
    const addPlaylistButton = await page.locator(`svg:has(path[d="M12 4.5v15m7.5-7.5h-15"])`).first();
    await addPlaylistButton.click();
    //Public
    await page.getByText("Enter a name for your new playlist and choose if it should be public or private.")
    await page.fill('input#name', playlistName);
    await page.getByRole("button").nth(1).click()
    await expect(page.getByText(playlistName)).toBeVisible()
    let addVideos= await page.locator("svg:has(circle)").last()
    await addVideos.click()
    //private
    await addPlaylistButton.click();
    await page.getByText("Enter a name for your new playlist and choose if it should be public or private.")
    await page.fill('input#name', privatePlaylistName);
    await page.getByText("Private").nth(1).click()
    await page.getByRole("button").nth(1).click()
    await expect(page.getByText(privatePlaylistName)).toBeVisible()
    await page.getByText(privatePlaylistName).click()
    addVideos= await page.locator("svg:has(circle)").last()
    await addVideos.click()

    await page.getByText("Trending Now").click()

    await page.getByText(playlistName).click()
    await expect(page.getByText(playlistName)).toBeVisible()

    await expect(page.getByText(privatePlaylistName)).not.toBeVisible()
})