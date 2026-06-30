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
}