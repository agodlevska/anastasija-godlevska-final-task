import { test as base, Page } from '@playwright/test';
import { generateRandomUser } from '../utils/userGenerator';
import { ShopUser, ShopApiClient } from '../utils/shopApiClient';
import { ShopHomePage } from '../pages/automationExercise/ShopHomePage';
import { SignupLoginPage } from '../pages/automationExercise/SignupLoginPage';
import { AccountCreationPage } from '../pages/automationExercise/AccountCreationPage';

type AuthenticatedShopFixture = {
    shopUser: ShopUser;
    authenticatedShopPage: Page; 
};

export const test = base.extend<AuthenticatedShopFixture>({
    shopUser: async ({}, use) => {
        const user = generateRandomUser();
        await use(user);
    },

    authenticatedShopPage: async ({ page, shopUser, request }, use) => {
        const homePage = new ShopHomePage(page);
        const signupPage = new SignupLoginPage(page);
        const accountPage = new AccountCreationPage(page);

        // UI registration
        await homePage.goto();
        await homePage.clickSignupLogin();
        await signupPage.startSignup(shopUser.name, shopUser.email);
        await accountPage.fillAccountDetails(shopUser);
        await accountPage.clickCreateAccount();
        await accountPage.assertAccountCreatedAndContinue();

        await use(page);

        // Сleanup
        const apiClient = new ShopApiClient(request);
        await apiClient.deleteAccount(shopUser.email, shopUser.password);
    },
});

export { expect } from '@playwright/test';