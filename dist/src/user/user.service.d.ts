import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './registerUser.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { EncryptionService } from 'src/encryption/encryption.service';
import { UpdateUserProfileDto } from './updateUserProfile.dto';
import { SubjectsEntity } from 'src/subjects/subjects.entity';
import { GradeEntity } from 'src/grade/grade.entity';
export declare class UserService {
    private userRepo;
    private subjectRepo;
    private gradeRepo;
    private readonly mailerService;
    private readonly encryptService;
    constructor(userRepo: Repository<UserEntity>, subjectRepo: Repository<SubjectsEntity>, gradeRepo: Repository<GradeEntity>, mailerService: MailerService, encryptService: EncryptionService);
    findAll(): Promise<UserEntity[]>;
    findOneById(id: string): Promise<UserEntity>;
    findOneByEmail(email: string): Promise<UserEntity>;
    updateUser(id: string, updateData: Partial<UserEntity>): Promise<import("typeorm").UpdateResult>;
    updateUserProfile(id: string, updateData: UpdateUserProfileDto, authUser: UserEntity): Promise<any>;
    create(data: RegisterUserDto): Promise<RegisterUserDto & UserEntity>;
    sendOTPMail(email: string, otp: string): Promise<{
        otp: string;
        decryptData: string;
    }>;
    sendMail(email: string, otp: string): Promise<{
        url: string;
        decryptData: string;
    }>;
    sendOTP(email: string, otp: string): Promise<UserEntity>;
    resendOTPMail(email: string, otp: string): Promise<{
        otp: string;
        decryptData: string;
    }>;
}
