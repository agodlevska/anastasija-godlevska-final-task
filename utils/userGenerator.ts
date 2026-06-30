import { ShopUser } from './shopApiClient';

export function generateRandomUser(): ShopUser {
    const timestamp = Date.now(); 
    
    return {
        name: `TestUser${timestamp}`,
        email: `testuser${timestamp}@automation.com`,
        password: 'Password123!',
        title: 'Mr',
        birth_date: '10',
        birth_month: '5',
        birth_year: '1990',
        firstname: 'John',
        lastname: 'Doe',
        company: 'QA Inc',
        address1: '123 Main Street',
        address2: 'Apt 4B',
        country: 'United States',
        state: 'New York',
        city: 'New York',
        zipcode: '10001',
        mobile_number: '+1234567890'
    };
}