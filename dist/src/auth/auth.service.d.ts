import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { serializedUser } from 'src/user/user.entity';
import { RegisterUserDto } from 'src/user/registerUser.dto';
import { Role } from 'src/roles/role.enum';
import { EncryptionService } from 'src/encryption/encryption.service';
import { ResendOTPDTO } from 'src/user/resendOTP.dto';
export declare class AuthService {
    private userService;
    private jwtService;
    private encryptService;
    constructor(userService: UserService, jwtService: JwtService, encryptService: EncryptionService);
    validateUser(email: string, password: string): Promise<serializedUser>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            username: any;
            email: any;
            id: any;
            role: any;
        };
    }>;
    verifyOtp(email: string, otp: string): Promise<string>;
    register(data: RegisterUserDto): Promise<{
        username: string;
        email: string;
        id: string;
        role: Role;
        email_verified: boolean;
    } | {
        access_token: string;
        user: {
            email: string;
            id: string;
            role: Role;
        };
    }>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(email: string, password: string, otp: string): Promise<import("typeorm").UpdateResult>;
    resendOTP(email: ResendOTPDTO): Promise<void>;
}
