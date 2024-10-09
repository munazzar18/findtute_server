import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/user/registerUser.dto';
import { VerifyOTPDto } from './verifyOTPdto.dto';
import { ForgotPasswordDto } from 'src/user/forgotPassword.dto';
import { ResetPasswordDTO } from 'src/user/resetPassword.dto';
import { ResendOTPDTO } from 'src/user/resendOTP.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    register(data: RegisterUserDto): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    verifyOtp(data: VerifyOTPDto): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    forgotPassword(data: ForgotPasswordDto): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    resetPassword(data: ResetPasswordDTO): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    resendOTP(email: ResendOTPDTO): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
}
