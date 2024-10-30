import { IsNotEmpty } from "class-validator";


export class CreateApplicationDto {

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    hourly_rate: number

    @IsNotEmpty()
    monthly_rate: number

    @IsNotEmpty()
    avatar: string

    @IsNotEmpty()
    preference: string

    @IsNotEmpty()
    lattitude: number

    @IsNotEmpty()
    longitude: number

    @IsNotEmpty()
    grades: string[]

    @IsNotEmpty()
    subjects: string[]

    user_id: string
}

export class StudentApplyDTO {

    @IsNotEmpty()
    application_id: string
}