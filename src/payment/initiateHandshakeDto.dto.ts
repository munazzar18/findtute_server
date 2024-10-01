import { IsNotEmpty } from "class-validator";


export class HandshakeDto {

    @IsNotEmpty()
    orderId: number
}

export class initiateHandshakeDTO {
    @IsNotEmpty()
    HS_RequestHash: string

    @IsNotEmpty()
    HS_ChannelId: string

    @IsNotEmpty()
    HS_ReturnURL: string

    @IsNotEmpty()
    HS_MerchantId: string

    @IsNotEmpty()
    HS_StoreId: string

    @IsNotEmpty()
    HS_MerchantHash: string

    @IsNotEmpty()
    HS_MerchantUsername: string

    @IsNotEmpty()
    HS_MerchantPassword: string

    @IsNotEmpty()
    HS_TransactionReferenceNumber: number

}


export class InititateCheckoutDto {

    @IsNotEmpty()
    orderId: number

    @IsNotEmpty()
    token: string

    @IsNotEmpty()
    returnUrl: string

    @IsNotEmpty()
    requestHash: string
}