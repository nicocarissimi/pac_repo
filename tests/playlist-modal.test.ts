import { test, expect, type Page } from '@playwright/test';

const user_new_email = 'franco@franco.franco';
const user_new_pass = 'franco';

function generateRandomString(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

test.beforeEach(async ({ page }) => {
    // LOGIN
    await page.goto('http://localhost:3000/auth');
    await page.fill('input#email', user_new_email);
    await page.fill('input#password', user_new_pass);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL('http://localhost:3000/profiles');
    await page.goto('http://localhost:3000/admin');
});

test.describe('Choose Tab', () => {
    test('should render the videos tab component', async ({ page }) => {
        const title = await page.getByTestId('videos-title').innerText();
        expect(title).toBe('Videos');
    });

    test('should render the playlists tab component', async ({ page }) => {
        const btn = page.getByTestId('playlists-btn');
        await btn.click();
        const title = await page.getByTestId('playlists-title').innerText();
        expect(title).toBe('Playlists');
    });

    test('should render the users tab component', async ({ page }) => {
        const btn = page.getByTestId('users-btn');
        await btn.click();
        const title = await page.getByTestId('users-title').innerText();
        expect(title).toBe('Users');
    });
});

test.describe('Video Modal', () => {

    test('should open the videos modal', async ({ page }) => {
        const btn = page.getByText('Add videos');
        await btn.click();
        const modal = page.getByTestId('videos-modal');
        await expect(modal).toBeVisible();
    });

    test('should add a video', async ({ page }) => {
        const btn = page.getByText('Add videos');
        await btn.click();
        await page.getByTestId('categories-select').click();
        const search = page.getByPlaceholder('Search...');
        expect(search).toBeVisible();
        await search.fill(generateRandomString());
        const addCategoryBtn = page.getByTestId('add-category-btn');
        await addCategoryBtn.click();
        await page.waitForTimeout(2000);
        const categoryContainer = page.getByTestId('categories-container');
        const categoryCount = await categoryContainer.locator('div').count(); 
        expect(categoryCount).toBe(1);
        await page.fill('input#title_input', 'Video Test');
        await page.fill('input#description_input', 'Description Test');
        await page.fill('input#author_input', 'Author Test');
        await page.fill('input#duration_input', '10');
        await page.fill('input#videoUrl_input', 'https://www.youtube.com/watch?v=video_test');
        await page.fill('input#thumbnailUrl_input', 'https://www.youtube.com/watch?v=thumbnail_test');
        const submit = page.getByTestId('submit-video-btn');
        await submit.click();
        const modal = page.getByTestId('videos-modal');
        await expect(modal).not.toBeVisible();



    })

    test('should close the video modal', async ({ page }) => {
        const btn = page.getByText('Add videos');
        await btn.click();

        const modal = page.getByTestId('videos-modal');
        await expect(modal).toBeVisible();

        const close = page.getByTestId('video-modal-close-btn');
        await close.click();

        // Wait until the modal is detached from the DOM or hidden
        await expect(modal).not.toBeVisible(); // Or
        // await expect(modal).not.toBeAttached();
    });
});

test.describe('Playlist Modal', () => {

    test('should open the playlists modal', async ({ page }) => {
        const playlistsBtn = page.getByTestId('playlists-btn');
        await playlistsBtn.click();
        const btn = page.getByText('Add playlists');
        await btn.click();
        const modal = page.getByTestId('playlists-modal');
        await expect(modal).toBeVisible();
    });

    test('should close the playlist modal', async ({ page }) => {
        const playlistsBtn = page.getByTestId('playlists-btn');
        await playlistsBtn.click();
        const btn = page.getByText('Add playlists');
        await btn.click();

        const modal = page.getByTestId('playlists-modal');
        await expect(modal).toBeVisible();

        const close = page.getByTestId('playlist-modal-close-btn');
        await close.click();

        // Wait until the modal is detached from the DOM or hidden
        await expect(modal).not.toBeVisible(); // Or
        // await expect(modal).not.toBeAttached();
    });
});
