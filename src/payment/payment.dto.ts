import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class PaymentDto {

    @IsNotEmpty()
    @IsNumber()
    amount: number

    @IsNotEmpty()
    @IsString()
    description: string


}