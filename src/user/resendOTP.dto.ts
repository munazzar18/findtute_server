import { IsNotEmpty } from "class-validator";


export class ResendOTPDTO {

    @IsNotEmpty()
    email: string
}