import { HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserProfileDto } from './updateUserProfile.dto';
import { UploadFileDto } from './uploadFile.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUsers(): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    getUserById(id: string): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    getUserByEmail(email: string): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    checkOtp(email: string, otp: string): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    sendMail(email: string, otp: string): Promise<{
        url: string;
        decryptData: string;
    }>;
    updateProfile(id: string, updateData: UpdateUserProfileDto, req: any): Promise<HttpException | {
        status: boolean;
        message: string;
        data: any;
    }>;
    uploadImage(data: UploadFileDto, file: Express.Multer.File, req: any): {
        status: boolean;
        message: string;
        data: any;
    };
}
