import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { sendJson } from 'src/helpers/helpers';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/role.guard';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { PaymentDto } from './payment.dto';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post('authenticate')
    async authenticate() {
        try {
            const authToken = await this.paymentService.authenticate()
            return authToken
        } catch (error) {
            throw new Error('Failed to authenticate' + error)
        }
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Teacher)
    @Post('create-transaction')
    async getLandingUrl(@Body() data: PaymentDto, @Request() req) {
        try {
            const user = req.user
            const url = await this.paymentService.getLandingPage(data, user)
            return sendJson(true, "url is recieved successfully", url)
        } catch (error) {
            throw new Error('Failed to get url:' + error)
        }
    }

    @Post('transaction')
    async createTransaction() {
        try {
            const transaction = await this.paymentService.createTransaction()
            return transaction
        } catch (error) {
            throw new Error('Failed to create Transaction due to:' + error)
        }
    }


}
