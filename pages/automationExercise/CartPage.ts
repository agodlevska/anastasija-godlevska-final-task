import { expect, Locator, Page } from "@playwright/test";
import { BaseShopPage } from "./BaseShopPage";

export class CartPage extends BaseShopPage {
    // Locators
    readonly cartProductRows: Locator;
    readonly proceedToCheckoutButton: Locator;
    readonly emptyCartMessage: Locator;

    constructor(page: Page) {
        super(page);

        this.cartProductRows = page.locator('#cart_info_table tbody tr');
        
        this.proceedToCheckoutButton = page.locator('.check_out');
        this.emptyCartMessage = page.locator('#empty_cart');
    }

    // Methods
    async removeProduct(index: number) {
        await this.cartProductRows.nth(index).locator('.cart_quantity_delete').click();
    }

    async clickProceedToCheckout() {
        await this.proceedToCheckoutButton.click();
    }

    async gotoCart() {
        await this.page.goto('/view_cart');
    }
}