import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class ProfileDto {

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
    @IsOptional()
    @IsString()
    avatar: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    preference: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    education: Record<string, any>[];

    @ApiProperty()
    @IsOptional()
    @IsArray()
    experience: Record<string, any>[];

    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    grades_ids: string[];

    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    subjects_ids: string[];

    is_active: boolean;

    is_deleted: boolean;

    is_verified: boolean;

    user_id: string;
}
