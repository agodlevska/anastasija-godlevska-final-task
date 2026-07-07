import { test, expect } from '../fixtures/authenticatedShopPage';
import { ShopHomePage } from '../pages/automationExercise/ShopHomePage';
import { SignupLoginPage } from '../pages/automationExercise/SignupLoginPage';
import { AccountCreationPage } from '../pages/automationExercise/AccountCreationPage';
import { ProductsPage } from '../pages/automationExercise/ProductsPage';
import { ProductDetailPage } from '../pages/automationExercise/ProductDetailPage';
import { CartPage } from '../pages/automationExercise/CartPage';
import { CheckoutPage } from '../pages/automationExercise/CheckoutPage';
import { PaymentPage } from '../pages/automationExercise/PaymentPage';
import { PaymentConfirmationPage } from '../pages/automationExercise/PaymentConfirmationPage';
import { ShopApiClient } from '../utils/shopApiClient';

test.describe('E-Commerce Shopping Flow', () => {

    test.beforeEach(async ({ page }) => {
        //Cookie banner
        await page.addLocatorHandler(page.getByRole('button', { name: 'Consent' }), async () => {
            await page.getByRole('button', { name: 'Consent' }).click();
        });
    });

    test('TC-SHOP-001 - Happy path: full shopping flow @epic("Shopping") @feature("Checkout") @story("Full E2E flow")', async ({ page, request, shopUser }) => {
    
        const homePage = new ShopHomePage(page);
        const signupPage = new SignupLoginPage(page);
        const accountPage = new AccountCreationPage(page);
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const paymentPage = new PaymentPage(page);
        const confirmPage = new PaymentConfirmationPage(page);
        const apiClient = new ShopApiClient(request);

        // Registation
        await homePage.goto();
        await homePage.clickSignupLogin();
        await signupPage.startSignup(shopUser.name, shopUser.email);
        await accountPage.fillAccountDetails(shopUser);
        await accountPage.clickCreateAccount();
        await accountPage.assertAccountCreatedAndContinue();
        await homePage.assertNavUsername(shopUser.name); 

        // Add product to the cart
        await homePage.clickProducts();
        await productsPage.hoverAndAddToCart(0); 
        await expect(productsPage.viewCartModalButton).toBeVisible(); 
        await cartPage.gotoCart();

        // Placing an order and payment
        await cartPage.clickProceedToCheckout();
        await checkoutPage.verifyDeliveryAddressMatches(shopUser.address1);
        await checkoutPage.placeOrder('Please deliver carefully.');
        await paymentPage.fillPaymentDetails('Test Name', '411111111111111', '123', '12', '2030');
        await paymentPage.clickPayAndConfirm();
        await confirmPage.assertOrderSuccess();

        // Cleaning (database)
        
        await apiClient.deleteAccount(shopUser.email, shopUser.password);
    });

    test('TC-SHOP-002 - Search: keyword search returns only matching products @epic("Shopping") @feature("Product Search")', async ({ page }) => {
        test.fail(true, 'Bug in the application: search returns irrelevant products (e.g., shorts instead of dress)');
        const productsPage = new ProductsPage(page);
        await productsPage.gotoProducts();
        
        await productsPage.search('dress');
        await productsPage.assertSearchResults('dress');
    });

    test('TC-SHOP-003 - Cart: adding multiple products updates the item count @epic("Shopping") @feature("Cart")', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);

        await productsPage.gotoProducts();
        
        // 1st product
        await productsPage.hoverAndAddToCart(0);
        await expect(productsPage.continueShoppingModalButton).toBeVisible();
        await productsPage.continueShoppingModalButton.click();

        // 2nd product
        await productsPage.hoverAndAddToCart(1);
        await expect(productsPage.viewCartModalButton).toBeVisible();
        await productsPage.viewCartModalButton.click();

        // We check that there are exactly 2 rows in the basket
        const rowsCount = await cartPage.cartProductRows.count();
        expect(rowsCount).toBe(2);
    });

    test('TC-SHOP-004 - Cart: removing a product updates the cart @epic("Shopping") @feature("Cart")', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);

        // Add the product
        await productsPage.gotoProducts();
        await productsPage.hoverAndAddToCart(0);
        await expect(productsPage.viewCartModalButton).toBeVisible();
        await productsPage.viewCartModalButton.click();

        // Wait until the cart items are loaded
        await expect(cartPage.cartProductRows.first()).toBeVisible();

        // Delete the product and wait for the message
        await cartPage.removeProduct(0);
        await expect(cartPage.emptyCartMessage).toBeVisible();
    });

    test('TC-SHOP-005 - Product detail: page shows correct data @epic("Shopping") @feature("Product Detail")', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const detailPage = new ProductDetailPage(page);

        await productsPage.gotoProducts();
        await productsPage.clickViewProduct(0);

        // Check that all elements on the product page are displayed
        await expect(detailPage.productName).toBeVisible();
        await expect(detailPage.productName).not.toBeEmpty();
        await expect(detailPage.productCategory).not.toBeEmpty();
        await expect(detailPage.productPrice).not.toBeEmpty();
        await expect(detailPage.productAvailability).not.toBeEmpty();
        await expect(detailPage.productCondition).not.toBeEmpty();
        await expect(detailPage.productBrand).not.toBeEmpty();
        await expect(detailPage.addToCartButton).toBeVisible();
    });

    // API tests

    test('TC-SHOP-006 - API: GET /productsList returns a valid product list @epic("API")', async ({ request }) => {
        const apiClient = new ShopApiClient(request);
        const data = await apiClient.getProducts();

        expect(data.responseCode).toBe(200);
        // products is an array with at least one element
        expect(Array.isArray(data.products)).toBe(true);
        expect(data.products.length).toBeGreaterThan(0);
         // Each product has id, name, price, brand, category
         const ids = new Set();
         for (const product of data.products) {
             expect(product).toHaveProperty('id');
             expect(product).toHaveProperty('name');
             expect(product).toHaveProperty('price');
             expect(product).toHaveProperty('brand');
             expect(product).toHaveProperty('category');
             ids.add(product.id);
         }
         // All id values are unique
         expect(ids.size).toBe(data.products.length);
    });

    test('TC-SHOP-007 - API: POST /searchProduct returns matching results @epic("API")', async ({ request }) => {
        test.fail(true, 'Bug in the backend API: returns irrelevant products (e.g., panda shirt) for keyword "top"');
        const apiClient = new ShopApiClient(request);
        const data = await apiClient.searchProducts('top');

        expect(data.responseCode).toBe(200);
        expect(data.products.length).toBeGreaterThan(0);
        
        for (const product of data.products) {
            expect(product.name.toLowerCase()).toContain('top');
        }
    });

    test('TC-SHOP-008 - API: POST /searchProduct with missing parameter @epic("API")', async ({ request }) => {
        const apiClient = new ShopApiClient(request);
        const data = await apiClient.searchProducts('');
        
        expect(data.responseCode).toBe(400);
        expect(data.message).toContain('search_product parameter is missing');
    });

    // Other tests

    test('TC-SHOP-009 - Subscription: subscribing from the footer shows a success message @epic("Marketing")', async ({ page }) => {
        const homePage = new ShopHomePage(page);
        await homePage.goto();
        
        await homePage.subscribeToNewsletter('test@newsletter.com');
        await homePage.assertSubscriptionSuccess();
    });

    test('TC-SHOP-010 - Session: authenticated user is redirected away from the login page @epic("Auth")', async ({ authenticatedShopPage, shopUser }) => {
        const homePage = new ShopHomePage(authenticatedShopPage);
        
        // Try to go to the login page while logged in
        await authenticatedShopPage.goto('/login');
        
        // Smart Wait
        await authenticatedShopPage.waitForURL(url => url.pathname === '/');
        
        // Check that haven't been logged out
        await homePage.assertNavUsername(shopUser.name);
    });
});