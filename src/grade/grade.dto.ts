import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"


export class CreateGradeDTO {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    grade: string

    profile_id: string
}