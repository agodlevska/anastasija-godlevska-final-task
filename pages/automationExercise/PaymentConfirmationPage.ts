import { expect, Locator, Page } from "@playwright/test";
import { BaseShopPage } from "./BaseShopPage";

export class PaymentConfirmationPage extends BaseShopPage {
    // Locators
    readonly successMessage: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        super(page);

        this.successMessage = page.locator('[data-qa="order-placed"]');
        this.continueButton = page.locator('[data-qa="continue-button"]');
    }

    // Methods
    async assertOrderSuccess() {
        await expect(this.successMessage).toBeVisible();
    }

    async clickContinue() {
        await this.continueButton.click();
    }
}