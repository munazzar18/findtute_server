"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const encryption_service_1 = require("../encryption/encryption.service");
const common_1 = require("@nestjs/common");
let PaymentService = class PaymentService {
    constructor(encryptService) {
        this.encryptService = encryptService;
    }
    async handShake(orderId) {
        const formData = {
            Key1: 'eHWqQFX47c66Kk55',
            Key2: '4860500040724782',
            HS_IsRedirectionRequest: "1",
            HS_RequestHash: "",
            HS_ChannelId: '1002',
            HS_ReturnURL: 'http://localhost:3000/payment-completed',
            HS_MerchantId: '27820',
            HS_StoreId: '039192',
            HS_MerchantHash: '0aFsbiT8uYBQKWZnuLKZtxFLa5hNSpb0pQMjFz0S1v+UCmH/DhnzzL4ZC/VX12HxZjOyOgRieR4=',
            HS_MerchantUsername: 'ebikyz',
            HS_MerchantPassword: 'RkRjXSDwXMVvFzk4yqF7CA==',
            HS_TransactionReferenceNumber: orderId,
        };
        const requestHash = this.encryptService.encryptRequestHash(formData);
        formData.HS_RequestHash = requestHash;
        return formData;
    }
    async initiateHandshake(data) {
        const formData = await this.handShake(data.orderId);
        const requestHash = formData.HS_RequestHash;
        const url = "https://sandbox.bankalfalah.com/HS/api/HSAPI/HSAPI";
        const encodedData = new URLSearchParams(formData).toString();
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: encodedData,
        });
        const returnedData = await response.json();
        return {
            requestHash,
            returnedData
        };
    }
    async initiateCheckout(data) {
        const newData = {
            AuthToken: data.token,
            RequestHash: data.requestHash,
            ChannelId: "1002",
            Currency: 'PKR',
            IsBIN: 0,
            ReturnURL: data.returnUrl,
            MerchantId: "27820",
            StoreId: "039192",
            MerchantHash: "0aFsbiT8uYBQKWZnuLKZtxFLa5hNSpb0pQMjFz0S1v+UCmH/DhnzzL4ZC/VX12HxZjOyOgRieR4=",
            MerchantUsername: "ebikyz",
            MerchantPassword: "RkRjXSDwXMVvFzk4yqF7CA==",
            TransactionTypeId: 3,
            TransactionReferenceNumber: data.orderId,
            TransactionAmount: 2999
        };
        const formData = new URLSearchParams(newData).toString();
        try {
            const response = await fetch('https://sandbox.bankalfalah.com/SSO/SSO/SSO', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const jsonResponse = await response.json();
                console.log("Response from Checkout API (JSON):", jsonResponse);
                return jsonResponse;
            }
            else {
                const htmlResponse = await response.text();
                console.log("Response from Checkout API (Non-JSON):", htmlResponse);
                return {
                    success: false,
                    message: 'Received non-JSON response',
                    html: htmlResponse
                };
            }
        }
        catch (error) {
            console.error("Error during checkout process:", error);
            throw new Error('Error during checkout process');
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [encryption_service_1.EncryptionService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map