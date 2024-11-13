import { test, expect } from '@playwright/test';
import prismadb from '@/libs/prismadb'
const user_login_email = "nick-testing-db@test.it"
const user_login_pass = "nick1234"

let categoryId = "";
let videoId = "";

async function setupData(){
    const categoryName = 'New Category'; // The name of the category to create
    const videoData = {
      title: 'My Video Title',
      description: 'This is a description of my video.',
      videoUrl: 'https://www.youtube.com/watch?v=7pBHAHGqok0',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Big.Buck.Bunny.-.Opening.Screen.png',
      author: 'Author Name',
      duration: 10, // Duration in seconds
    };
  
    try {
      // Create a new category
      const newCategory = await prismadb.category.create({
        data: {
          name: categoryName,
        },
      });
  
      console.log('Category created successfully:', newCategory);
      categoryId = newCategory.id;
  
      // Create the video and associate it with the new category
      const newVideo = await prismadb.video.create({
        data: {
          ...videoData,
          categories: {
            create: {
              category: {
                connect: {
                  id: newCategory.id, // Connect to the newly created category
                },
              },
            },
          },
        },
      });
  
      console.log('Video created successfully:', newVideo);
      videoId = newVideo.id;
    } catch (error) {
      console.error('Error creating category or video:', error);
    }
}
async function cleanData(){
    try{
        await prismadb.video.delete({
            where:{
                id: videoId
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
    await setupData();
})
test.beforeEach(async ({ page }) => {
    //Sign-in
    await page.goto('/');
    await page.fill('input#email', user_login_email);
    await page.fill('input#password', user_login_pass);
    await page.click('button:has-text("Login")');

    await page.waitForURL('**/profiles');
    await page.click('img:first-of-type');
});
test('Homepage land', async ({ page }) => {
    await expect(page).toHaveURL('/');
});
test('find video section', async ({ page }) => {
    const TrendingNowSection = await page.locator('text=New Category');
    await expect(TrendingNowSection).toBeDefined();
    await TrendingNowSection.click()
    const videoCard= await page.locator(`img[src="https://upload.wikimedia.org/wikipedia/commons/7/70/Big.Buck.Bunny.-.Opening.Screen.png"]`)
    await expect(videoCard.first()).toBeVisible();
});
test('clicking video image redirect to video', async ({ page }) => {
    const TrendingNowSection = await page.locator('text=New Category');
    await expect(TrendingNowSection).toBeDefined();
    const videoCard= page.locator(`img[src="https://upload.wikimedia.org/wikipedia/commons/7/70/Big.Buck.Bunny.-.Opening.Screen.png"]`).first();
    await videoCard.click();
    await expect(page).toHaveURL(new RegExp(`.*${videoId}.*`))
});

test.afterAll(async()=>{
    await cleanData();
})