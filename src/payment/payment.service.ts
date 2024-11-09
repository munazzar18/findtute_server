import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
    private baseUrl: string;
    private merchantId: string;
    private headers;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>('ABHIPAY_BASE_URL');
        this.merchantId = this.configService.get<string>('ABHIPAY_MERCHANT_ID');
        this.headers = {
            Authorization: `Bearer ${process.env.ABHIPAY_SECRET_KEY}`,
            'Content-Type': 'application/json',
        };
    }

    private async makeRequest(method: string, endpoint: string, data: any) {
        try {
            console.log(data)
            const url = `${this.baseUrl}/${endpoint}`;
            const response = await this.httpService[method](url, data, {
                headers: this.headers,
            }).toPromise();
            console.log(response.data)
            return response.data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Payment API error', error.response?.status || 500);
        }
    }

    // Method for creating an order
    async createOrder(amount: number, description: string, urls: { approveURL: string, cancelURL: string, declineURL: string }) {
        const data = {
            merchant: this.merchantId,
            body: {
                amount,
                currencyType: 'PKR',
                description,
                language: 'EN',
                approveURL: urls.approveURL,
                cancelURL: urls.cancelURL,
                declineURL: urls.declineURL,
                uuid: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                cardStorage: true,
            },
        };
        return this.makeRequest('post', 'createOrder', data);
    }

    // Method to get order information
    async getOrderInformation(sessionId: string) {
        const data = {
            merchant: this.merchantId,
            body: { sessionId },
        };
        return this.makeRequest('post', 'getOrderInformation', data);
    }

    // Pre-auth (lock amount)
    async preAuth(amount: number, description: string, approveURL: string) {
        const data = {
            merchant: this.merchantId,
            body: {
                amount,
                currencyType: 'PKR',
                description,
                language: 'EN',
                approveURL,
            },
        };
        return this.makeRequest('post', 'preAuth', data);
    }

    // Complete payment
    async completeOrder(amount: number, description: string, orderId: string) {
        const data = {
            merchant: this.merchantId,
            body: {
                amount,
                description,
                language: 'EN',
                orderId,
            },
        };
        return this.makeRequest('post', 'completeOrder', data);
    }

    // Create an invoice
    async createInvoice(invoiceDetails: any) {
        const data = {
            merchant: this.merchantId,
            body: invoiceDetails,
        };
        return this.makeRequest('post', 'invoices', data);
    }

    // Get invoice information
    async getInvoice(uuid: string) {
        const data = {
            merchant: this.merchantId,
            body: { uuid },
        };
        return this.makeRequest('post', 'get-invoice', data);
    }

    // Update an invoice
    async updateInvoice(invoiceId: string, invoiceUpdateDetails: any) {
        const url = `invoices/${invoiceId}`;
        return this.makeRequest('put', url, { merchant: this.merchantId, body: invoiceUpdateDetails });
    }
}
