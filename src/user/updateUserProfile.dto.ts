import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class UpdateUserProfileDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    last_name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    cnic: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    mobile: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    latitude: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    longitude: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty()
    avatar: string;

    @ApiProperty()
    preference: string;

    @ApiProperty()
    @IsNotEmpty()
    education: Record<string, any>[];

    @ApiProperty()
    experience: Record<string, any>[];

    @ApiProperty()
    grades_ids: string[];

    @ApiProperty()
    subjects_ids: string[];
}
