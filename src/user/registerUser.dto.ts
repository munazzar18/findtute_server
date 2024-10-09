
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { Role } from "src/roles/role.enum";


export class RegisterUserDto {


    @IsNotEmpty()
    username: string


    @IsEmail()
    @IsNotEmpty()
    email: string;


    @IsNotEmpty()
    @MinLength(8)
    password: string;


    @IsNotEmpty()
    roles: Role;


    @IsNotEmpty()
    privacy_terms_conditions: boolean;


    first_name: string;


    last_name: string;


    cnic: string;


    mobile: string;


    latitude: number;


    longitude: number;


    address: string;


    avatar: string;


    preference: string;


    education: Record<string, any>[];


    experience: Record<string, any>[];


    grades_ids: string[];


    subjects_ids: string[];

    otp: string;

    expiry_otp: number

}