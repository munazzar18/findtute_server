import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { generateEncryptedHash, generateRandomString, switchHash } from 'src/helpers/helpers';
import * as fs from 'fs';
import * as path from 'path';
import { PaymentDto } from './payment.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class PaymentService {
    private switchUrl: string;
    constructor(private configService: ConfigService) {
        this.switchUrl = this.configService.get<string>('SWITCH_URL');
    }

    async authenticate() {
        try {
            const authUrl = 'https://sandbox-auth.swichnow.com/connect/token'
            const client_id = process.env.CLIENT_ID
            const client_secret = process.env.CLIENT_SECRET
            const data = new URLSearchParams()
            data.append('grant_type', 'client_credentials')
            data.append('client_id', client_id)
            data.append('client_secret', client_secret)

            const response = await axios.post(
                authUrl,
                data.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            },
            );
            return response.data

        } catch (error) {
            console.error('Error authenticating with switch API:', error.response?.data || error.message);
            throw new HttpException(
                error.response?.data || 'Failed to authenticate with Switch API',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getLandingPage(data: PaymentDto, user: UserEntity) {
        const client_id = process.env.CLIENT_ID
        const customerTransacionId = generateRandomString(13)
        const item = generateRandomString(7)
        const amount = data.amount
        const checkSum = switchHash(customerTransacionId, item, amount)

        const payload = {
            clientId: client_id,
            customertransactionid: customerTransacionId,
            item: item,
            amount: amount,
            channel: 0,
            checksum: checkSum,
            description: data.description,
            payeename: user.username,
            email: user.email,
            msisdn: user.mobile,
            successRedirectUrl: `${process.env.FRONT_END_URL}/dashboard/payment-successfull`,
        }

        const baseUrl = process.env.SWITCH_URL

        const url = `${baseUrl}?clientId=${payload.clientId}&customerTransactionid=${payload.customertransactionid}&item=${payload.item}&amount=${payload.amount}&channel=0&PayeeName=${payload.payeename}&Email=${payload.email}&MSISDN=${payload.msisdn}&description=${payload.description.split(' ').join('-')}&currency=PKR&checksum=${payload.checksum}&successRedirectUrl=${payload.successRedirectUrl}`

        return url

    }

    async createTransaction() {
        const client_id = process.env.CLIENT_ID
        const customerTransacionId = generateRandomString(13)
        const item = generateRandomString(5)
        const amount = 500
        const checksum = switchHash(customerTransacionId, item, amount)
        const secret = process.env.SECRET_KEY
        const baseUrl = process.env.SWITCH_URL

        const payload = {
            "clientId": client_id,
            "CustomerTransactionId": customerTransacionId,
            "Item": item,
            "Amount": amount,
            "Channel": 0,
            "Checksum": checksum,
            "Description": "Testing",
            "PayeeName": 'Munazzar',
            "Email": 'gex.18@hotmail.com',
            "MSISDN": '03333206162'
        }

        try {
            const token = generateEncryptedHash(payload, secret)


            const response = await axios.post(`https://sandbox-payinpwa20.swichnow.com/Transaction/Index`, {
                ClientId: client_id,
                Token: token
            })

            return response.data

        } catch (error) {
            console.error('Error creating transaction:', error.response?.data || error.message);
            throw new HttpException(
                error.response?.data || 'Failed',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

    }


}
