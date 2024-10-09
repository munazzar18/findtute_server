import { IsNotEmpty, IsString } from "class-validator"

export class SubjectsDto {


    @IsString()
    @IsNotEmpty()
    subject: string

    user_id: string

}