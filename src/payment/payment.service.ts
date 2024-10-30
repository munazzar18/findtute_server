import { EncryptionService } from 'src/encryption/encryption.service';
import { Injectable } from '@nestjs/common';
import { HandshakeDto, InititateCheckoutDto } from './initiateHandshakeDto.dto';
import { UserService } from 'src/user/user.service';
import { encodedToken } from 'src/auth/bcrypt';
import { ApplicationService } from 'src/application/application.service';
import { UserEntity } from 'src/user/user.entity';
@Injectable()
export class PaymentService {
    constructor(
        private readonly encryptService: EncryptionService,
        private readonly userService: UserService,
        private readonly applicationService: ApplicationService
    ) { }

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





}
