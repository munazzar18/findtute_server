import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class PaymentDto {

    @IsNotEmpty()
    @IsNumber()
    amount: number

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsString()
    package: string


}


export class CreatePaymentDto {

    @IsNotEmpty()
    order_id: string

    @IsNotEmpty()
    customer_name: string

    @IsNotEmpty()
    status: string

    @IsNotEmpty()
    amount: number

    @IsNotEmpty()
    package: string

    user_id: string

    transaction_id: string

}

export class PaymentStatusDto {

    @IsNotEmpty()
    status: string

    @IsNotEmpty()
    transaction_id: string

    @IsNotEmpty()
    amount: number

    @IsNotEmpty()
    package: string

}

export class PaymentInquireDto {

    @IsNotEmpty()
    transaction_id: string
}