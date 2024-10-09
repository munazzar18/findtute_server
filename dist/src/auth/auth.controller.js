"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const passport_1 = require("@nestjs/passport");
const helpers_1 = require("../helpers/helpers");
const registerUser_dto_1 = require("../user/registerUser.dto");
const verifyOTPdto_dto_1 = require("./verifyOTPdto.dto");
const swagger_1 = require("@nestjs/swagger");
const forgotPassword_dto_1 = require("../user/forgotPassword.dto");
const resetPassword_dto_1 = require("../user/resetPassword.dto");
const resendOTP_dto_1 = require("../user/resendOTP.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(req) {
        const token = await this.authService.login(req.user);
        return (0, helpers_1.sendJson)(true, 'User login successfully', {
            access_token: token.access_token,
            user: token.user
        });
    }
    async register(data) {
        const user = await this.authService.register(data);
        return (0, helpers_1.sendJson)(true, 'User register successfully', user);
    }
    async verifyOtp(data) {
        const verify = await this.authService.verifyOtp(data.email, data.otp);
        return (0, helpers_1.sendJson)(true, "Otp Verified", {
            access_token: verify
        });
    }
    async forgotPassword(data) {
        const forgot = await this.authService.forgotPassword(data.email);
        return (0, helpers_1.sendJson)(true, "Password reset link sent to your email", {});
    }
    async resetPassword(data) {
        const reset = await this.authService.resetPassword(data.email, data.password, data.otp);
        return (0, helpers_1.sendJson)(true, "Password reset successfully", {});
    }
    async resendOTP(email) {
        const sendOTP = await this.authService.resendOTP(email);
        return (0, helpers_1.sendJson)(true, "One time password sent to your email", {});
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('local')),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registerUser_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verifyOTPdto_dto_1.VerifyOTPDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgotPassword_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resetPassword_dto_1.ResetPasswordDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resendOTP_dto_1.ResendOTPDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendOTP", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map