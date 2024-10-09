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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const bcrypt_1 = require("./bcrypt");
const user_entity_1 = require("../user/user.entity");
const helpers_1 = require("../helpers/helpers");
const role_enum_1 = require("../roles/role.enum");
const encryption_service_1 = require("../encryption/encryption.service");
let AuthService = class AuthService {
    constructor(userService, jwtService, encryptService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.encryptService = encryptService;
    }
    async validateUser(email, password) {
        const userDb = await this.userService.findOneByEmail(email);
        if (userDb) {
            const matched = (0, bcrypt_1.comparePass)(password, userDb.password);
            if (matched) {
                return new user_entity_1.serializedUser(userDb);
            }
            else {
                throw new common_1.UnauthorizedException('Invalid Credentials');
            }
        }
        else {
            throw new common_1.UnauthorizedException('Invalid Credentials');
        }
    }
    async login(user) {
        const payload = {
            username: user.username,
            email: user.email,
            id: user.id,
            role: user.roles
        };
        const accessToken = this.jwtService.sign(payload);
        return {
            access_token: accessToken,
            user: {
                username: payload.username,
                email: payload.email,
                id: payload.id,
                role: payload.role
            }
        };
    }
    async verifyOtp(email, otp) {
        const currentTime = new Date().getTime();
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException("Invalid Credentials");
        }
        else {
            const expiry = user.expiry_otp;
            const dbOtp = user.otp;
            if (expiry >= currentTime) {
                if (otp === dbOtp) {
                    user.email_verified = true;
                    await this.userService.updateUser(user.id, { email_verified: true });
                    const newUser = {
                        username: user.username,
                        email: user.email,
                        id: user.id,
                        role: user.roles,
                        email_verified: user.email_verified
                    };
                    const accessToken = this.jwtService.sign(newUser);
                    return accessToken;
                }
                else {
                    throw new common_1.BadRequestException("OTP is incorrect");
                }
            }
            else {
                throw new common_1.BadRequestException("OTP Expired");
            }
        }
    }
    async register(data) {
        const allowedRoles = [role_enum_1.Role.Parent, role_enum_1.Role.Student, role_enum_1.Role.Teacher];
        if (!allowedRoles.includes(data.roles)) {
            throw new common_1.HttpException('Invalid role, you can only select parent, student or teacher', common_1.HttpStatus.FORBIDDEN);
        }
        const userDb = await this.userService.findOneByEmail(data.email);
        if (userDb) {
            throw new common_1.HttpException('user with this email already exists', common_1.HttpStatus.CONFLICT);
        }
        else {
            const otp_service = await (0, helpers_1.generateOtp)();
            const otp = otp_service.OTP;
            const expiry_otp = otp_service.expiryTime;
            const password = (0, bcrypt_1.encodedPass)(data.password);
            const newUser = await this.userService.create({ ...data, password, otp, expiry_otp });
            await this.userService.sendOTPMail(data.email, otp);
            const payload = {
                username: newUser.username,
                email: newUser.email,
                id: newUser.id,
                role: newUser.roles,
                email_verified: newUser.email_verified
            };
            return payload;
            const accessToken = this.jwtService.sign(payload);
            return {
                access_token: accessToken,
                user: {
                    email: payload.email,
                    id: payload.id,
                    role: payload.role
                }
            };
        }
    }
    async forgotPassword(email) {
        try {
            const user = await this.userService.findOneByEmail(email);
            if (!user) {
                throw new common_1.HttpException('user with this email does not exist', common_1.HttpStatus.NOT_FOUND);
            }
            const otp_service = await (0, helpers_1.generateOtp)();
            const otp = otp_service.OTP;
            const expiry_otp = otp_service.expiryTime;
            await this.userService.updateUser(user.id, { otp, expiry_otp });
            const data = await this.userService.sendMail(email, otp);
            return;
        }
        catch (error) {
            throw new Error(`Something went wrong. Error: ${error}`);
        }
    }
    async resetPassword(email, password, otp) {
        const getMail = await this.encryptService.decrypt(email);
        const user = await this.userService.findOneByEmail(getMail);
        if (!user) {
            throw new common_1.HttpException('user with this email does not exist', common_1.HttpStatus.NOT_FOUND);
        }
        else {
            const expiry = user.expiry_otp;
            const dbOtp = user.otp;
            const currentTime = new Date().getTime();
            if (expiry >= currentTime) {
                if (otp === dbOtp) {
                    const updatedUser = await this.userService.updateUser(user.id, { password: (0, bcrypt_1.encodedPass)(password) });
                    console.log("RETURNED DATA:", updatedUser);
                    return updatedUser;
                }
                else {
                    throw new common_1.BadRequestException("OTP is incorrect");
                }
            }
            else {
                throw new common_1.BadRequestException("OTP Expired");
            }
        }
    }
    async resendOTP(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmail = emailRegex.test(email.email);
        if (!isEmail) {
            const getMail = await this.encryptService.decrypt(email.email);
            const user = await this.userService.findOneByEmail(getMail);
            if (!user) {
                throw new common_1.HttpException('user with this email does not exist', common_1.HttpStatus.NOT_FOUND);
            }
            else {
                const otp_service = await (0, helpers_1.generateOtp)();
                const otp = otp_service.OTP;
                const expiry_otp = otp_service.expiryTime;
                await this.userService.updateUser(user.id, { otp, expiry_otp });
                await this.userService.resendOTPMail(getMail, otp);
                return;
            }
        }
        else {
            const user = await this.userService.findOneByEmail(email.email);
            if (!user) {
                throw new common_1.HttpException('user with this email does not exist', common_1.HttpStatus.NOT_FOUND);
            }
            else {
                const otp_service = await (0, helpers_1.generateOtp)();
                const otp = otp_service.OTP;
                const expiry_otp = otp_service.expiryTime;
                await this.userService.updateUser(user.id, { otp, expiry_otp });
                await this.userService.resendOTPMail(email.email, otp);
                return;
            }
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        encryption_service_1.EncryptionService])
], AuthService);
//# sourceMappingURL=auth.service.js.map