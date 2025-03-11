import { Controller, Post, Body, Get, UseGuards, Request, Param, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { sendJson } from 'src/helpers/helpers';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/role.guard';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { PaymentDto, PaymentInquireDto, PaymentStatusDto } from './payment.dto';
import { PaymentStatus } from './paymentStatus.enum';
import { serializedUser } from 'src/user/user.entity';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }


    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Teacher)
    @Get('user-payments')
    async getUserPayments(@Request() req) {
        try {
            const user = req.user
            const payments = await this.paymentService.getUserLocalPayment(user)
            return sendJson(true, "User payments fetched successfully", payments)
        } catch (error) {
            return sendJson(false, "Failed to get user payments", error)
        }
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Teacher)
    @Post('inquire-transaction')
    async inquireTransaction(@Body() data: PaymentInquireDto, @Request() req) {
        try {

            const user = req.user
            const transaction = await this.paymentService.inquireTransaction(data, user)
            const serializedApplication = new serializedUser(transaction.teacher)
            return sendJson(true, "Transaction fetched successfully", [])
        } catch (error) {
            return sendJson(false, "Failed to get transaction", error)
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
            return sendJson(false, "Failed to get url")
        }
    }


    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Teacher)
    @Post('payment-status/paymentId/:id')
    async paymentStatus(@Param('id') id: string, @Body() data: PaymentStatusDto, @Request() req) {
        try {
            const user = req.user
            const payment = await this.paymentService.updatePaymentStatus(id, data, user)
            return sendJson(true, "Payment status updated successfully", payment)
        } catch (error) {
            return sendJson(false, "Failed to update payment status", error)
        }
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Teacher)
    @Get('create-application')
    async createApplication(@Request() req, @Query('paymentId') paymentId: string) {
        try {
            const user = req.user
            const application = await this.paymentService.handlePaymentStatusUpdate(paymentId, user)
            const serializedApplication = new serializedUser(application.teacher)
            return sendJson(true, "Application created successfully", application)
        } catch (error) {
            return sendJson(false, "Failed to create application", error)
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
