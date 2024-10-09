import { IsNotEmpty, IsString } from "class-validator"


export class CreateGradeDTO {


    @IsString()
    @IsNotEmpty()
    grade: string

    user_id: string
}