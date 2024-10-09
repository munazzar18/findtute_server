
import { IsNotEmpty } from "class-validator";


export class ResetPasswordDTO {


    @IsNotEmpty()
    email: string;


    @IsNotEmpty()
    password: string


    @IsNotEmpty()
    otp: string;


}