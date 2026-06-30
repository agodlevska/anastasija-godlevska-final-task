import { expect, Page } from "@playwright/test";

export class BaseShopPage {

    constructor(readonly page: Page) {
    }
    // Methods
    async goto(path: string = '/') {
        await this.page.goto(path);
    }

    async assertNavUsername(username: string) {
        await expect(this.page.locator('li:has-text("Logged in as")')).toContainText(username);
    }
}