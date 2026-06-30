import { APIRequestContext } from "@playwright/test";

export interface ProductsResponse {
    responseCode: number;
    products: any[];
    message?: string;
}

export interface ShopUser {
    name: string;
    email: string;
    password: string;
    title: string;
    birth_date: string;
    birth_month: string;
    birth_year: string;
    firstname: string;
    lastname: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    zipcode: string;
    state: string;
    city: string;
    mobile_number: string;
    
    }

export class ShopApiClient {
    constructor(private readonly request: APIRequestContext) {}

    async getProducts(): Promise<ProductsResponse> {
        const response = await this.request.get('/api/productsList');
        const body = await response.json();
        
        if (!response.ok()) throw new Error(`getProducts failed ${response.status()}: ${JSON.stringify(body)}`);
        
        return body as ProductsResponse;
    }

    async searchProducts(keyword: string): Promise<ProductsResponse> {
        const formData: Record<string, string> = {};
        if (keyword) {
            formData.search_product = keyword;
        }
        
        const response = await this.request.post('/api/searchProduct', {
            form: formData
        });

        const body = await response.json();
        if (!response.ok()) throw new Error(`searchProducts failed ${response.status()}: ${JSON.stringify(body)}`);

        return body as ProductsResponse;
    }

    async createAccount(user: ShopUser): Promise<void> {
        const response = await this.request.post('/api/createAccount', {
            form: {...user}
        });

        const body = await response.json();
        if (!response.ok()) throw new Error(`createAccount failed ${response.status()}: ${JSON.stringify(body)}`);
    }

    async verifyLogin(email: string, password: string): Promise<boolean> {
        const response = await this.request.post('/api/verifyLogin', {
            form: { email, password }
        });

        const body = await response.json();
        if (!response.ok()) throw new Error(`verifyLogin failed ${response.status()}: ${JSON.stringify(body)}`);
        
        return body.responseCode === 200;
    }

    async deleteAccount(email: string, password: string): Promise<void> {
        const response = await this.request.delete('/api/deleteAccount', {
            form: { email, password }
        });

        if (!response.ok()) throw new Error(`deleteAccount failed ${response.status()}`);
    }
}