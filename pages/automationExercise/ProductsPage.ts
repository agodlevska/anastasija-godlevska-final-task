import { expect, Locator, Page } from "@playwright/test";
import { BaseShopPage } from "./BaseShopPage";

export class ProductsPage extends BaseShopPage {
    // Locators
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly searchedProductsHeading: Locator;
    readonly productCards: Locator;
    readonly continueShoppingModalButton: Locator;
    readonly viewCartModalButton: Locator;

    constructor(page: Page) {
        super(page);

        this.searchInput = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');
        this.searchedProductsHeading = page.locator('.title:has-text("Searched Products")');
        
        this.productCards = page.locator('.single-products');
        
        this.continueShoppingModalButton = page.getByRole('button', { name: 'Continue Shopping' });
        this.viewCartModalButton = page.getByRole('link', { name: 'View Cart' }).first();
    }

    // Methods
    async gotoProducts() {
        await this.page.goto('/products');
    }

    async search(keyword: string) {
        await this.searchInput.fill(keyword);
        await this.searchButton.click();
    }

    async hoverAndAddToCart(index: number) {
        const product = this.productCards.nth(index);
        await product.hover();
        
        await product.locator('.add-to-cart').first().click();
    }

    async clickViewProduct(index: number) {
        await this.page.locator('.choose > .nav > li > a').nth(index).click();
    }

    async assertSearchResults(keyword: string) {
        // The heading "Searched Products" is displayed
        await expect(this.searchedProductsHeading).toBeVisible();

        // At least one product result is shown
        const count = await this.productCards.count();
        expect(count).toBeGreaterThan(0);

        // All visible product cards contain the keyword (case-insensitive) in their name
        for (let i = 0; i < count; i++) {
            const name = await this.productCards.nth(i).locator('p').first().textContent();
            expect(name?.toLowerCase()).toContain(keyword.toLowerCase());
        }
    }


}