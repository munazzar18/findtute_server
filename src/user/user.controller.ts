import { Body, ClassSerializerInterceptor, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Put, Query, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { sendJson } from '../helpers/helpers';
import { serializedUser } from './user.entity';
import { UserService } from './user.service';
import { UpdateUserProfileDto } from './updateUserProfile.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UploadFileDto } from './uploadFile.dto';
import { FileUrlInterceptor } from './fileUrlInterceptor';
import { Role } from 'src/roles/role.enum';
import { RolesGuard } from 'src/roles/role.guard';
import { Roles } from 'src/roles/role.decorator';



@Controller('user')

export class UserController {
    constructor(private readonly userService: UserService) { }


    @UseInterceptors(ClassSerializerInterceptor, FileUrlInterceptor)
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
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
    @UseGuards(AuthGuard)
    // @UseInterceptors(FileUrlInterceptor)
    @Get('/match')
    async getMatchingUsers(@Request() req) {
        const user = req.user
        const userId = user.id
        const users = await this.userService.findMatching(userId)
        if (users.length > 0) {
            const allUsers = users.map((user => new serializedUser(user)))
            return sendJson(true, 'fetched all users successfully', allUsers)
        }
        else {
            throw new HttpException('No users found', HttpStatus.NOT_FOUND)
        }
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard)
    @Get('/browse')
    async findAllUsers(@Request() req, @Query('page') page: number) {
        const user = req.user
        const userId = user.id
        const users = await this.userService.findAllUsers(userId, page)
        if (users.data.length > 0) {
            const allUsers = users.data.map((user => new serializedUser(user)))
            return sendJson(true, 'fetched all users successfully', { users: allUsers, pageData: users.pageData })
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
            destination: './images',
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

        const fileUrl = '/images/' + file.filename;
        return sendJson(true, 'Images uploaded successfully', fileUrl)
    }

    // Update to handle paths based on the environment
    @Get('uploads/:filename')
    getImage(@Param('filename') filename: string, @Res() res) {
        // Absolute path for images folder (relative to the project root, not dist folder)
        const imagePath = join(process.cwd(), 'images', filename);

        // Send the file
        return res.sendFile(imagePath, (err) => {
            if (err) {
                console.error('File not found:', imagePath);
                return res.status(404).json({ message: 'File not found', error: err });
            }
        });
    }

}
