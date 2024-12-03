import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post('create-order')
    createOrder(@Body() createOrderDto: any) {
        console.log(createOrderDto)
        return this.paymentService.createOrder(
            createOrderDto.amount,
            createOrderDto.description,
            createOrderDto.urls,
        );
    }

    @Post('get-order-info')
    getOrderInformation(@Body() body: { sessionId: string }) {
        return this.paymentService.getOrderInformation(body.sessionId);
    }

    @Post('pre-auth')
    preAuth(@Body() body: any) {
        return this.paymentService.preAuth(body.amount, body.description, body.approveURL);
    }

    @Post('complete-order')
    completeOrder(@Body() body: any) {
        return this.paymentService.completeOrder(body.amount, body.description, body.orderId);
    }

    @Post('create-invoice')
    createInvoice(@Body() invoiceDetails: any) {
        return this.paymentService.createInvoice(invoiceDetails);
    }

    @Post('get-invoice')
    getInvoice(@Body() body: { uuid: string }) {
        return this.paymentService.getInvoice(body.uuid);
    }

    @Post('update-invoice')
    updateInvoice(@Body() body: any) {
        return this.paymentService.updateInvoice(body.invoiceId, body.invoiceUpdateDetails);
    }
}
