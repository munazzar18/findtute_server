import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class UpdateUserProfileDto {


    @IsNotEmpty()
    @IsString()
    first_name: string;


    @IsNotEmpty()
    @IsString()
    last_name: string;


    @IsNotEmpty()
    @IsString()
    cnic: string;


    @IsNotEmpty()
    @IsString()
    mobile: string;


    @IsNotEmpty()
    @IsNumber()
    lattitude: number;


    @IsNotEmpty()
    @IsNumber()
    longitude: number;


    @IsNotEmpty()
    @IsString()
    address: string;


    avatar: string;


    preference: string;


    @IsNotEmpty()
    education: Record<string, any>[];


    experience: Record<string, any>[];


    grades_ids: string[];


    subjects_ids: string[];
}
