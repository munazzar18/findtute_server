import { Body, ClassSerializerInterceptor, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Put, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { sendJson } from '../helpers/helpers';
import { serializedUser } from './user.entity';
import { UserService } from './user.service';
import { RegisterUserDto } from './registerUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserProfileDto } from './updateUserProfile.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UploadFileDto } from './uploadFile.dto';


@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(private readonly userService: UserService) { }


    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    async getUsers() {
        const users = await this.userService.findAll()
        if (users.length > 0) {
            const allUsers = users.map((user => new serializedUser(user)))
            return sendJson(true, 'fetched all users successfully', allUsers)
        }
        else {
            throw new HttpException('No users found', HttpStatus.NOT_FOUND)
        }
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/id/:id')
    async getUserById(@Param('id') id: string) {
        const userById = await this.userService.findOneById(id)
        if (userById) {
            const user = new serializedUser(userById)
            return sendJson(true, 'user found for this id', user)
        }
        else {
            throw new NotFoundException('user not found for this id')
        }
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/email/:email')
    async getUserByEmail(@Param('email') email: string) {
        const userbyEmail = await this.userService.findOneByEmail(email)
        if (userbyEmail) {
            const user = new serializedUser(userbyEmail)
            return sendJson(true, 'user found for this email', user)
        }
        else {
            throw new NotFoundException('user not found for this email')
        }
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('validateOtp')
    async checkOtp(
        @Query('email') email: string,
        @Query('otp') otp: string
    ) {
        const user = await this.userService.sendOTP(email, otp)
        const savedUser = new serializedUser(user)
        return sendJson(true, 'Otp validation', savedUser)
    }

    @Post('sendmail')
    async sendMail(@Body("email") email: string, otp: string) {
        return await this.userService.sendMail(email, otp)
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard)
    @Put('/update-profile/:id')
    async updateProfile(@Param('id') id: string, @Body() updateData: UpdateUserProfileDto, @Request() req) {
        try {
            const authUser = req.user;
            const updatedUser = await this.userService.updateUserProfile(id, updateData, authUser);
            const savedUser = new serializedUser(updatedUser);
            return sendJson(true, 'Profile updated successfully', savedUser);
        } catch (error) {
            if (error instanceof HttpException) {
                return error;
            }
            console.error(error);
            return sendJson(false, 'Failed to update profile', { message: error.message });
        }
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './public/uploads/',
            filename: (req, file, callback) => {
                const orginalName = file.originalname;
                const extention = extname(orginalName)
                const fileName = Date.now() + extention;
                callback(null, fileName)
            }
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
    }))

    uploadImage(@Body() data: UploadFileDto, @UploadedFile() file: Express.Multer.File, @Request() req) {

        const fileUrl = '/public/uploads/' + file.filename;
        return sendJson(true, 'Images uploaded successfully', fileUrl)
    }

}
