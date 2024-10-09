import { PaymentService } from './payment.service';
import { HandshakeDto, InititateCheckoutDto } from './initiateHandshakeDto.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    handshake(data: HandshakeDto): Promise<{
        Key1: string;
        Key2: string;
        HS_IsRedirectionRequest: string;
        HS_RequestHash: string;
        HS_ChannelId: string;
        HS_ReturnURL: string;
        HS_MerchantId: string;
        HS_StoreId: string;
        HS_MerchantHash: string;
        HS_MerchantUsername: string;
        HS_MerchantPassword: string;
        HS_TransactionReferenceNumber: number;
    }>;
    initiateHandshake(data: HandshakeDto): Promise<{
        requestHash: string;
        returnedData: any;
    }>;
    initiateCheckout(data: InititateCheckoutDto): Promise<any>;
}
