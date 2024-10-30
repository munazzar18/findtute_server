import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { HandshakeDto, initiateHandshakeDTO, InititateCheckoutDto } from './initiateHandshakeDto.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';

@Controller('payment')
export class PaymentController {

    constructor(

        private readonly paymentService: PaymentService
    ) { }

    @Post('handshake')
    async handshake(@Body() data: HandshakeDto) {
        return await this.paymentService.handShake(data.orderId)
    }

    @Post('initiateHandshake')
    async initiateHandshake(@Body() data: HandshakeDto) {
        return await this.paymentService.initiateHandshake(data)
    }


    @Post('checkout')
    async initiateCheckout(@Body() data: InititateCheckoutDto) {

        return await this.paymentService.initiateCheckout(data)
    }

    @UseGuards(AuthGuard)
    @Roles(Role.Teacher)
    @Post('create-payment')
    async createPayment(@Request() req) {
        const data = req.user
        return await this.paymentService.createPayment(data)
    }


}
