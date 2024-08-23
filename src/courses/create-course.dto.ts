import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateCourseDto {

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    course: Record<string, any>[]

    @ApiProperty()
    @IsArray()
    grade: Record<string, any>[]

    user_id: string;
}
