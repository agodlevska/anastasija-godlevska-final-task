import { expect, Locator, Page } from "@playwright/test";
import { BaseShopPage } from "./BaseShopPage";

export class ShopHomePage extends BaseShopPage {
    // Locators
    readonly signupLoginLink: Locator;
    readonly productsLink: Locator;
    readonly cartLink: Locator;
    readonly subscribeEmailInput: Locator;
    readonly subscribeButton: Locator;
    readonly successSubscribeMessage: Locator;

    constructor(page: Page) {
        super(page);

        this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
        
        this.productsLink = page.locator('a[href="/products"]');
        this.cartLink = page.locator('a[href="/view_cart"]').first();

        this.subscribeEmailInput = page.locator('#susbscribe_email');
        this.subscribeButton = page.locator('#subscribe');
        this.successSubscribeMessage = page.locator('#success-subscribe');
    }

    // Methods
    async assertOnHomePage() {
        await expect(this.page).toHaveURL('/');
    }

    async clickSignupLogin() {
        await this.signupLoginLink.click();
    }

    async clickProducts() {
        await this.productsLink.click();
    }

    async subscribeToNewsletter(email: string) {
        await this.subscribeEmailInput.fill(email);
        await this.subscribeButton.click();
    }

    async assertSubscriptionSuccess() {
        await expect(this.successSubscribeMessage).toBeVisible();
    }
}