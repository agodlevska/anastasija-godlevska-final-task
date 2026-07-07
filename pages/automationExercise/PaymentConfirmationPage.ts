import { expect, Locator, Page } from "@playwright/test";
import { BaseShopPage } from "./BaseShopPage";

export class PaymentConfirmationPage extends BaseShopPage {
    // Locators
    readonly successMessage: Locator;
    readonly continueButton: Locator;
    readonly downloadInvoiceLink: Locator;

    constructor(page: Page) {
        super(page);

        this.successMessage = page.locator('[data-qa="order-placed"]');
        this.continueButton = page.locator('[data-qa="continue-button"]');
        this.downloadInvoiceLink = page.getByRole('link', { name: 'Download Invoice' });
    }

    // Methods
    async assertOrderSuccess() {
        await expect(this.successMessage).toBeVisible();
        await expect(this.page).toHaveURL(/payment_done/);
        await expect(this.downloadInvoiceLink).toBeVisible();
        const invoiceHref = await this.downloadInvoiceLink.getAttribute('href');
        expect(invoiceHref).toMatch(/\/download_invoice\/\d+/);
    }

    async clickContinue() {
        await this.continueButton.click();
    }
}