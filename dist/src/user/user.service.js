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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./user.entity");
const typeorm_2 = require("typeorm");
const mailer_1 = require("@nestjs-modules/mailer");
const encryption_service_1 = require("../encryption/encryption.service");
const path = require("path");
const fs_1 = require("fs");
const subjects_entity_1 = require("../subjects/subjects.entity");
const grade_entity_1 = require("../grade/grade.entity");
let UserService = class UserService {
    constructor(userRepo, subjectRepo, gradeRepo, mailerService, encryptService) {
        this.userRepo = userRepo;
        this.subjectRepo = subjectRepo;
        this.gradeRepo = gradeRepo;
        this.mailerService = mailerService;
        this.encryptService = encryptService;
    }
    async findAll() {
        return await this.userRepo.find();
    }
    async findOneById(id) {
        return await this.userRepo.findOneBy({ id });
    }
    async findOneByEmail(email) {
        return await this.userRepo.findOneBy({ email });
    }
    async updateUser(id, updateData) {
        return await this.userRepo.update(id, updateData);
    }
    async updateUserProfile(id, updateData, authUser) {
        try {
            const getUser = await this.userRepo.findOne({
                where: {
                    id,
                    is_deleted: false
                },
                relations: ['grades', 'subjects']
            });
            if (!getUser) {
                throw new Error('User profile is not found');
            }
            if (getUser.email_verified === false) {
                throw new Error('Please verify your email first');
            }
            if (authUser.id !== id) {
                throw new Error('You are not authorized to update this user profile');
            }
            const subjectsIdsArray = Array.isArray(updateData.subjects_ids) ?
                updateData.subjects_ids : JSON.parse(updateData.subjects_ids);
            const gradesIdsArray = Array.isArray(updateData.grades_ids) ?
                updateData.grades_ids : JSON.parse(updateData.grades_ids);
            updateData.subjects_ids = subjectsIdsArray.map(id => id.toString());
            updateData.grades_ids = gradesIdsArray.map(id => id.toString());
            const subjects = await this.subjectRepo.find({
                where: { id: (0, typeorm_2.In)(updateData.subjects_ids) }
            });
            const grades = await this.gradeRepo.find({
                where: { id: (0, typeorm_2.In)(updateData.grades_ids) }
            });
            getUser.grades = grades;
            getUser.subjects = subjects;
            const updatedUser = await this.userRepo.save({
                ...getUser,
                ...updateData,
                is_active: getUser.is_active,
                is_deleted: getUser.is_deleted,
                is_verified: true,
                is_online: getUser.is_online,
                is_Authorized: getUser.is_authorized,
            });
            return updatedUser;
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
    async create(data) {
        return await this.userRepo.save(data);
    }
    async sendOTPMail(email, otp) {
        const templatePath = path.join(process.cwd(), 'public', 'OTP.html');
        let emailHtml = await fs_1.promises.readFile(templatePath, 'utf-8');
        emailHtml = emailHtml.replace('[User Name]', email);
        emailHtml = emailHtml.replace('[Verification Code]', otp);
        const encrypted = await this.encryptService.encrypt(email);
        const dycrypted = await this.encryptService.decrypt(encrypted);
        await this.mailerService.sendMail({
            to: email,
            from: 'noreply@findtute.com',
            subject: 'FindTute email verification code',
            html: emailHtml,
        })
            .then((success) => {
            console.log("Verification email sent successfully:", success);
        })
            .catch((err) => {
            console.log("Verification email not sent:", err);
        });
        return {
            otp: otp,
            decryptData: dycrypted,
        };
    }
    async sendMail(email, otp) {
        const templatePath = path.join(process.cwd(), 'public', 'forgotPassword.html');
        let emailHtml = await fs_1.promises.readFile(templatePath, 'utf-8');
        const encrypted = await this.encryptService.encrypt(email);
        const frontUrl = process.env.FORGOT_PASSWORD_URl;
        const url = `${frontUrl}/${encrypted}`;
        const dycrypted = await this.encryptService.decrypt(encrypted);
        emailHtml = emailHtml.replace('[User Name]', email);
        emailHtml = emailHtml.replace('[Verification Code]', otp);
        emailHtml = emailHtml.replace('[Verification Link]', url);
        await this.mailerService.sendMail({
            to: email,
            from: 'noreply@findtute.com',
            subject: 'Password reset link',
            html: emailHtml,
        })
            .then((success) => {
            console.log("Verification email sent successfully:", success);
        })
            .catch((err) => {
            console.log("Verification email not sent:", err);
        });
        return {
            url: url,
            decryptData: dycrypted,
        };
    }
    async sendOTP(email, otp) {
        const currentTime = new Date().getTime();
        const user = await this.findOneByEmail(email);
        const expiry = user.expiry_otp;
        const dbOtp = user.otp;
        if (expiry >= currentTime) {
            if (otp === dbOtp) {
                return await this.userRepo.save(user);
            }
            else {
                throw new common_1.BadRequestException("OTP is incorrect");
            }
        }
        else {
            throw new common_1.BadRequestException("OTP Expired");
        }
    }
    async resendOTPMail(email, otp) {
        const templatePath = path.join(process.cwd(), 'public', 'ResendOTP.html');
        let emailHtml = await fs_1.promises.readFile(templatePath, 'utf-8');
        emailHtml = emailHtml.replace('[User Name]', email);
        emailHtml = emailHtml.replace('[Verification Code]', otp);
        const encrypted = await this.encryptService.encrypt(email);
        const dycrypted = await this.encryptService.decrypt(encrypted);
        await this.mailerService.sendMail({
            to: email,
            from: 'noreply@findtute.com',
            subject: 'FindTute email verification code',
            html: emailHtml,
        })
            .then((success) => {
            console.log("One time password is sent successfully:", success);
        })
            .catch((err) => {
            console.log("One time password is not sent:", err);
        });
        return {
            otp: otp,
            decryptData: dycrypted,
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(subjects_entity_1.SubjectsEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(grade_entity_1.GradeEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        mailer_1.MailerService,
        encryption_service_1.EncryptionService])
], UserService);
//# sourceMappingURL=user.service.js.map