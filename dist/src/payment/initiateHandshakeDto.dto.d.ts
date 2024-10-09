export declare class HandshakeDto {
    orderId: number;
}
export declare class initiateHandshakeDTO {
    HS_RequestHash: string;
    HS_ChannelId: string;
    HS_ReturnURL: string;
    HS_MerchantId: string;
    HS_StoreId: string;
    HS_MerchantHash: string;
    HS_MerchantUsername: string;
    HS_MerchantPassword: string;
    HS_TransactionReferenceNumber: number;
}
export declare class InititateCheckoutDto {
    orderId: number;
    token: string;
    returnUrl: string;
    requestHash: string;
}
