import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { Role } from "src/roles/role.enum";


export class RegisterUserDto {

    @ApiProperty()
    @IsNotEmpty()
    username: string

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

    @ApiProperty()
    @IsNotEmpty()
    privacy_terms_conditions: boolean;

    @ApiProperty()
    first_name: string;

    @ApiProperty()
    last_name: string;

    @ApiProperty()
    cnic: string;

    @ApiProperty()
    mobile: string;

    @ApiProperty()
    latitude: number;

    @ApiProperty()
    longitude: number;

    @ApiProperty()
    address: string;

    @ApiProperty()
    avatar: string;

    @ApiProperty()
    preference: string;

    @ApiProperty()
    education: Record<string, any>[];

    @ApiProperty()
    experience: Record<string, any>[];

    @ApiProperty()
    grades_ids: string[];

    @ApiProperty()
    subjects_ids: string[];

    otp: string;

    expiry_otp: number

}