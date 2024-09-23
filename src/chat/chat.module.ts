import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { JwtModule } from "@nestjs/jwt";
import { JwtConstants } from "src/constants/jwtConstants";
import { UserService } from "src/user/user.service";
import { EncryptionService } from "src/encryption/encryption.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { GradeEntity } from "src/grade/grade.entity";
import { SubjectsEntity } from "src/subjects/subjects.entity";



@Module({
    imports: [
        JwtModule.register({
            secret: JwtConstants.secret
        }),
        TypeOrmModule.forFeature([UserEntity, GradeEntity, SubjectsEntity]),
    ],
    providers: [ChatGateway, UserService, EncryptionService],
})
export class ChatModule { }