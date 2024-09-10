import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class SubjectsDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    subject: string

    user_id: string

}