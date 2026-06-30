import { expect, Locator, Page } from "@playwright/test";
import { BaseShopPage } from "./BaseShopPage";

export class CheckoutPage extends BaseShopPage {
    readonly deliveryAddressBlock: Locator;
    readonly orderCommentInput: Locator;
    readonly placeOrderButton: Locator;

    constructor(page: Page) {
        super(page);
        this.deliveryAddressBlock = page.locator('#address_delivery');
        this.orderCommentInput = page.locator('textarea[name="message"]');
        this.placeOrderButton = page.getByRole('link', { name: 'Place Order' });
    }

    async verifyDeliveryAddressMatches(expectedAddress: string) {
        await expect(this.deliveryAddressBlock).toContainText(expectedAddress);
    }

    async placeOrder(comment: string) {
        await this.orderCommentInput.fill(comment);
        // Force click to bypass overlapping UI elements 
        await this.placeOrderButton.click({ force: true });
    }
}