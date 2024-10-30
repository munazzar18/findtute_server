import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { sendJson } from '../helpers/helpers';
import { RegisterUserDto } from 'src/user/registerUser.dto';
import { VerifyOTPDto } from './verifyOTPdto.dto';

import { ForgotPasswordDto } from 'src/user/forgotPassword.dto';
import { ResetPasswordDTO } from 'src/user/resetPassword.dto';
import { ResendOTPDTO } from 'src/user/resendOTP.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        const token = await this.authService.login(req.user)
        return sendJson(true, 'User login successfully', {
            access_token: token.access_token,
            user: token.user
        })
    }

    @Post('register')
    async register(@Body() data: RegisterUserDto) {
        const user = await this.authService.register(data)
        return sendJson(true, 'User register successfully', user)
    }

    @Post('verify-otp')
    async verifyOtp(@Body() data: VerifyOTPDto) {
        const verify = await this.authService.verifyOtp(data.email, data.otp)
        return sendJson(true, "Otp Verified", {
            access_token: verify.access_token,
            user: verify.user
        })
    }

    @Post('forgot-password')
    async forgotPassword(@Body() data: ForgotPasswordDto) {
        const forgot = await this.authService.forgotPassword(data.email)
        return sendJson(true, "Password reset link sent to your email", {})
    }

    @Post('reset-password')
    async resetPassword(@Body() data: ResetPasswordDTO) {
        const reset = await this.authService.resetPassword(data.email, data.password, data.otp)
        return sendJson(true, "Password reset successfully", {})
    }

    @Post('resend-otp')
    async resendOTP(@Body() email: ResendOTPDTO) {
        const sendOTP = await this.authService.resendOTP(email)
        return sendJson(true, "One time password sent to your email", {})
    }

}
