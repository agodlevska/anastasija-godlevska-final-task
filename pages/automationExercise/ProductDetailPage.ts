import { expect, Locator, Page } from "@playwright/test";
import { BaseShopPage } from "./BaseShopPage";

export class ProductDetailPage extends BaseShopPage {
    // Locators
    readonly productName: Locator;
    readonly productCategory: Locator;
    readonly productPrice: Locator;
    readonly productAvailability: Locator;
    readonly productCondition: Locator;
    readonly productBrand: Locator;
    readonly addToCartButton: Locator;

    constructor(page: Page) {
        super(page);

        this.productName = page.locator('.product-information h2');
        this.productCategory = page.locator('.product-information p:has-text("Category")');
        this.productPrice = page.locator('.product-information span span');
        this.productAvailability = page.locator('.product-information p:has-text("Availability:")');
        this.productCondition = page.locator('.product-information p:has-text("Condition:")');
        this.productBrand = page.locator('.product-information p:has-text("Brand:")');
        
        this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    }
}