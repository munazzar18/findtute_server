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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const helpers_1 = require("../helpers/helpers");
const user_entity_1 = require("./user.entity");
const user_service_1 = require("./user.service");
const swagger_1 = require("@nestjs/swagger");
const updateUserProfile_dto_1 = require("./updateUserProfile.dto");
const auth_guard_1 = require("../auth/auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const uploadFile_dto_1 = require("./uploadFile.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUsers() {
        const users = await this.userService.findAll();
        if (users.length > 0) {
            const allUsers = users.map((user => new user_entity_1.serializedUser(user)));
            return (0, helpers_1.sendJson)(true, 'fetched all users successfully', allUsers);
        }
        else {
            throw new common_1.HttpException('No users found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getUserById(id) {
        const userById = await this.userService.findOneById(id);
        if (userById) {
            const user = new user_entity_1.serializedUser(userById);
            return (0, helpers_1.sendJson)(true, 'user found for this id', user);
        }
        else {
            throw new common_1.NotFoundException('user not found for this id');
        }
    }
    async getUserByEmail(email) {
        const userbyEmail = await this.userService.findOneByEmail(email);
        if (userbyEmail) {
            const user = new user_entity_1.serializedUser(userbyEmail);
            return (0, helpers_1.sendJson)(true, 'user found for this email', user);
        }
        else {
            throw new common_1.NotFoundException('user not found for this email');
        }
    }
    async checkOtp(email, otp) {
        const user = await this.userService.sendOTP(email, otp);
        const savedUser = new user_entity_1.serializedUser(user);
        return (0, helpers_1.sendJson)(true, 'Otp validation', savedUser);
    }
    async sendMail(email, otp) {
        return await this.userService.sendMail(email, otp);
    }
    async updateProfile(id, updateData, req) {
        try {
            const authUser = req.user;
            const updatedUser = await this.userService.updateUserProfile(id, updateData, authUser);
            const savedUser = new user_entity_1.serializedUser(updatedUser);
            return (0, helpers_1.sendJson)(true, 'Profile updated successfully', savedUser);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                return error;
            }
            console.error(error);
            return (0, helpers_1.sendJson)(false, 'Failed to update profile', { message: error.message });
        }
    }
    uploadImage(data, file, req) {
        const fileUrl = '/public/uploads/' + file.filename;
        return (0, helpers_1.sendJson)(true, 'Images uploaded successfully', fileUrl);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.Get)('/id/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.Get)('/email/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserByEmail", null);
__decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.Get)('validateOtp'),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Query)('otp')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkOtp", null);
__decorate([
    (0, common_1.Post)('sendmail'),
    __param(0, (0, common_1.Body)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "sendMail", null);
__decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('/update-profile/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateUserProfile_dto_1.UpdateUserProfileDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './public/uploads/',
            filename: (req, file, callback) => {
                const orginalName = file.originalname;
                const extention = (0, path_1.extname)(orginalName);
                const fileName = Date.now() + extention;
                callback(null, fileName);
            }
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uploadFile_dto_1.UploadFileDto, Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "uploadImage", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, swagger_1.ApiTags)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map