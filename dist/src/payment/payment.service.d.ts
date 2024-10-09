import { EncryptionService } from 'src/encryption/encryption.service';
import { HandshakeDto, InititateCheckoutDto } from './initiateHandshakeDto.dto';
export declare class PaymentService {
    private readonly encryptService;
    constructor(encryptService: EncryptionService);
    handShake(orderId: number): Promise<{
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
