import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { calculateExpiryDate, generateEncryptedHash, generateRandomString, switchHash } from 'src/helpers/helpers';
import { CreatePaymentDto, PaymentDto, PaymentInquireDto, PaymentStatusDto } from './payment.dto';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { PaymentEntity } from './payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationEntity } from 'src/application/application.entity';
import { compareToken } from 'src/auth/bcrypt';
import { PaymentStatus } from './paymentStatus.enum';
import { UserService } from 'src/user/user.service';


@Injectable()
export class PaymentService {
    private switchUrl: string;
    private switchBaseUrl: string;
    constructor(
        private configService: ConfigService,
        @InjectRepository(PaymentEntity) private readonly paymentRepo: Repository<PaymentEntity>,
        @InjectRepository(ApplicationEntity) private readonly applicationRepo: Repository<ApplicationEntity>,
        private userService: UserService
    ) {
        this.switchUrl = this.configService.get<string>('SWITCH_URL');
        this.switchBaseUrl = this.configService.get<string>('SWITCH_BASE_URL');
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
        const amount = 1
        const checkSum = switchHash(customerTransacionId, item, amount)
        const orderId = generateRandomString(6)

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
            successRedirectUrl: `${process.env.FRONT_END_URL}/dashboard/payment-successfull?customerTransactionid=${customerTransacionId}&item=${item}&amount=${amount}&checksum=${checkSum}`,
        }

        const baseUrl = process.env.SWITCH_URL

        const url = `${baseUrl}?clientId=${payload.clientId}&customerTransactionid=${payload.customertransactionid}&item=${payload.item}&amount=${payload.amount}&channel=0&PayeeName=${payload.payeename}&Email=${payload.email}&MSISDN=${payload.msisdn}&description=${payload.description.split(' ').join('-')}&currency=PKR&checksum=${payload.checksum}&successRedirectUrl=${payload.successRedirectUrl}`

        const paymentPayLoad = {
            amount: data.amount,
            customer_name: user.username,
            order_id: orderId,
            status: PaymentStatus.Pending,
            transaction_id: customerTransacionId,
            package: data.package,
            user_id: user.id
        }

        const payment = await this.createLocalPayment(paymentPayLoad, user)

        console.log("url", url)


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

            console.log(response)

            return response.data

        } catch (error) {
            console.error('Error creating transaction:', error.response?.data || error.message);
            throw new HttpException(
                error.response?.data || 'Failed',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

    }

    async createLocalPayment(data: CreatePaymentDto, authUser: UserEntity) {
        const payment = this.paymentRepo.create({
            amount: data.amount,
            customer_name: data.customer_name,
            order_id: data.order_id,
            status: PaymentStatus.Pending,
            transaction_id: data.transaction_id,
            package: data.package,
            user_id: authUser.id

        })
        await this.paymentRepo.save(payment)
        return payment
    }

    async inquireTransaction(transactionId: PaymentInquireDto) {
        const baseUrl = process.env.SWITCH_BASE_URL
        const { transaction_id } = transactionId

        const token = await this.authenticate()

        console.log("token", token)

        // const response = await axios.get(`${baseUrl}/gateway/payin/inquire?CustomerTransactionId=${transaction_id}`, {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // })
        const response = await fetch(`${baseUrl}/gateway/payin/inquire?CustomerTransactionId=${transaction_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.access_token}`
            }
        })
        const data = await response.json()
        console.log("response", data)
        return data

        // try {
        //     const response = await axios.get(`${baseUrl}/gateway/payin/inquire?CustomerTransactionId=${transaction_id}`)
        //     console.log("response", response.data)
        //     return response.data
        // } catch (error) {
        //     console.error('Error inquiring transaction:', error.response?.data || error.message);
        //     throw new HttpException(
        //         error.response?.data || 'Failed',
        //         error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        //     );

        // }
    }

    async updatePaymentStatus(paymentId: string, data: PaymentStatusDto, authUser: UserEntity) {

        const { status } = data;
        try {
            const payment = await this.paymentRepo.findOne({
                where: {
                    id: paymentId,
                    user_id: authUser.id,
                    transaction_id: data.transaction_id,
                    amount: data.amount,
                    package: data.package,
                }
            });

            if (!payment) {
                throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
            }

            if (status === 'completed') {
                payment.status = PaymentStatus.Completed;
                await this.paymentRepo.save(payment);
                return payment;
            } else if (status === 'failed') {
                payment.status = PaymentStatus.Failed;
                await this.paymentRepo.save(payment);
                return payment;
            } else {
                throw new HttpException('Invalid payment status', HttpStatus.BAD_REQUEST);
            }


        } catch (error) {
            console.error('Error updating payment status:', error);
            throw new HttpException(
                error.response?.data || 'Failed to update payment status',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }


    }

    async getUserLocalPayment(authUser: UserEntity) {
        const payments = await this.paymentRepo.find({ where: { user_id: authUser.id } })
        return payments
    }

    async handlePaymentStatusUpdate(paymentId: string, authUser: UserEntity) {
        const user = await this.userService.findOneById(authUser.id)

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }


        const payment = await this.paymentRepo.findOne({
            where: {
                id: paymentId,
                user_id: user.id
            }
        })

        if (!payment) {
            throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
        }

        const paymentHash = user.is_authorized;
        const token = user.first_name + user.last_name + user.email + user.id
        const isTokenValid = compareToken(token, paymentHash);

        if (!isTokenValid) {
            throw new Error('Invalid payment token');
        }


        let randName: string;
        let isUnique = false;

        while (!isUnique) {
            randName = generateRandomString(17);
            const appExists = await this.applicationRepo.findOne({ where: { name: randName } });

            if (!appExists) {
                isUnique = true;
            }
        }

        if (payment.status === PaymentStatus.Completed) {
            const expiryDate = calculateExpiryDate(payment.package)
            const application = this.applicationRepo.create({
                preference: user.preference,
                grades: user.grades?.map(grade => grade.grade || grade.id),
                subjects: user.subjects?.map(subject => subject.subject || subject.id),
                user_id: user.id,
                avatar: user.avatar,
                hourly_rate: user.hourly_rate,
                monthly_rate: user.monthly_rate,
                lattitude: user.lattitude,
                longitude: user.longitude,
                teacher: user,
                teacher_accepted: true,
                name: randName,
                expiry_date: expiryDate
            })

            await this.applicationRepo.save(application);

            return application
        }

        throw new Error('Payment is not completed');
    }


}
