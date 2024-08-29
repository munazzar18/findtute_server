import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty } from "class-validator"


export class CreateGradeDTO {

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    grade: Record<string, any>[]

    profile_id: string
}