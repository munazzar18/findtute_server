import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { Role } from "src/roles/role.enum";


export class RegisterUserDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    roles: Role;

    otp: string;

    expiry_otp: number

    email_verified: boolean
}