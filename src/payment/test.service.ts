import { EncryptionService } from 'src/encryption/encryption.service';
import { Injectable, HttpException, Inject } from '@nestjs/common';
import { HandshakeDto, InititateCheckoutDto } from './initiateHandshakeDto.dto';
import { UserService } from 'src/user/user.service';
import { encodedToken } from 'src/auth/bcrypt';
import { ApplicationService } from 'src/application/application.service';
import { UserEntity } from 'src/user/user.entity';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
@Injectable()
export class PaymentService {
    private privateKey: string;
    private easypaisaPublicKey: string;
    constructor(
        private readonly encryptService: EncryptionService,
        private readonly userService: UserService,
        private readonly applicationService: ApplicationService,
        private httpService: HttpService,
        @Inject('PRIVATE_KEY') privateKey: string,
        @Inject('EASYPAISA_PUBLIC_KEY') easypaisaPublicKey: string,

    ) {
        this.privateKey = privateKey;
        this.easypaisaPublicKey = easypaisaPublicKey;
    }

    private generateSignature(payload: Record<string, any>): string {
        const jsonPayload = JSON.stringify(payload).replace(/\s+/g, '');
        const sign = crypto.createSign('RSA-SHA256');
        sign.update(jsonPayload);
        return sign.sign(this.privateKey, 'base64');
    }

    private getBasicAuthHeader(username: string, password: string): string {
        return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
    }

    async createPayment(data: UserEntity) {

        const user = await this.userService.findOneById(data.id)

        if (!user) {
            throw new Error('user not found')
        }

        const token = user.first_name + user.last_name + user.email + user.id

        const paymentHash = encodedToken(token)

        const updateUser = await this.userService.updateUser(user.id, { is_authorized: paymentHash })

        if (!updateUser) {
            throw new Error('something went wrong updating is_authorized')
        }

        const grades = await this.userService.getGradesForUser(user.id)

        const subjects = await this.userService.getSubjectsForUser(user.id)

        const application = await this.applicationService.create({
            ...user,
            grades,
            subjects
        })

        return {
            updateUser,
            application
        }
    }



    async handShake(orderId: number) {
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
        // formData.HS_RequestHash = encodeURIComponent(requestHash);

        return formData;
    }

    async initiateHandshake(data: HandshakeDto) {
        const formData = await this.handShake(data.orderId);
        const requestHash = formData.HS_RequestHash;
        const url = "https://sandbox.bankalfalah.com/HS/api/HSAPI/HSAPI";

        const encodedData = new URLSearchParams(formData as any).toString();

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


    async initiateCheckout(data: InititateCheckoutDto) {
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

        // Convert the newData object to a URL-encoded string
        const formData = new URLSearchParams(newData as any).toString();

        try {
            // Simulate form submission using fetch
            const response = await fetch('https://sandbox.bankalfalah.com/SSO/SSO/SSO', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });

            const contentType = response.headers.get('content-type');

            // Check if response is JSON or HTML (as it may return an HTML error page)
            if (contentType && contentType.includes('application/json')) {
                const jsonResponse = await response.json();
                console.log("Response from Checkout API (JSON):", jsonResponse);
                return jsonResponse;
            } else {
                const htmlResponse = await response.text();
                console.log("Response from Checkout API (Non-JSON):", htmlResponse);
                return {
                    success: false,
                    message: 'Received non-JSON response',
                    html: htmlResponse
                };
            }
        } catch (error) {
            console.error("Error during checkout process:", error);
            throw new Error('Error during checkout process');
        }
    }

    async initiateTransaction(requestData: Record<string, any>): Promise<AxiosResponse> {
        const { orderId, storeId, transactionAmount, transactionType, mobileAccountNo, emailAddress } = requestData;

        const username = 'findtute';
        const password = '7@#*2KjqJAka36V';

        // Step 1: Build the payload
        const payload = {
            orderId,
            storeId,
            transactionAmount,
            transactionType,
            mobileAccountNo,
            emailAddress,
        };

        // Step 2: Generate RSA signature
        const signature = this.generateSignature(payload);

        // Step 3: Set headers
        const headers = {
            'Content-Type': 'application/json',
            'Credentials': this.getBasicAuthHeader(username, password),
        };

        // Step 4: Build API request payload with signature
        const apiRequest = {
            request: payload,
            signature,
        };

        console.log(headers)

        try {
            // Step 5: Make the HTTP POST request
            const response = await this.httpService
                .post('https://easypaystg.easypaisa.com.pk/easypay-service/rest/v5/initiate-ma-transaction', apiRequest, {
                    headers,
                })
                .toPromise();

            console.log(response.data);

            // Optional: Verify Easypaisa's response signature if necessary
            const isValidSignature = this.verifyResponseSignature(JSON.stringify(response.data));
            if (!isValidSignature) {
                throw new Error('Invalid response signature');
            }

            return response;
        } catch (error) {
            throw new HttpException(`Transaction failed: ${error.message}`, error.response?.status || 500);
        }
    }

    // Method to verify Easypaisa's response signature (similar to previous)
    private verifyResponseSignature(responseData: string): boolean {
        // [Verification code as implemented previously]
        return true; // Assuming verification is implemented correctly
    }



}
