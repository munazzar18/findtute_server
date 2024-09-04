import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './registerUser.dto';
import { MailerService } from '@nestjs-modules/mailer';
// import { Twilio } from 'twilio';
import { EncryptionService } from 'src/encryption/encryption.service';
import * as path from 'path';
import { promises as fs } from 'fs';
import { UpdateUserProfileDto } from './updateUserProfile.dto';


@Injectable()
export class UserService {
    // private twilioClient: Twilio;
    constructor(
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        private readonly mailerService: MailerService,
        private readonly encryptService: EncryptionService

    ) { }

    async findAll() {
        return await this.userRepo.find()
    }

    async findOneById(id: string) {
        return await this.userRepo.findOneBy({ id })
    }

    async findOneByEmail(email: string) {
        return await this.userRepo.findOneBy({ email })
    }

    async updateUser(id: string, updateData: Partial<UserEntity>) {
        return await this.userRepo.update(id, updateData)
    }

    async updateUserProfile(id: string, updateData: UpdateUserProfileDto, authUser: UserEntity) {
        try {
            const getUser = await this.userRepo.findOneBy({ id, is_deleted: false });
            if (!getUser) {
                throw new Error('User profile is not found');
            }

            if (getUser.email_verified === false) {
                throw new Error('Please verify your email first');
            }

            if (authUser.id !== id) {
                throw new Error('You are not authorized to update this user profile');
            }

            const updatedUser = await this.userRepo.save({
                ...getUser,
                ...updateData,
                is_active: getUser.is_active,
                is_deleted: getUser.is_deleted,
                is_verified: getUser.is_verified,
                is_online: getUser.is_online,
                is_Authorized: getUser.is_Authorized,
            });
            return updatedUser

        } catch (error) {
            console.log(error)
            return error
        }
    }

    async create(data: RegisterUserDto) {
        return await this.userRepo.save(data)

    }

    async sendOTPMail(email: string, otp: string) {

        // const templatePath = path.join(__dirname, '../templates/OTP.html')
        const templatePath = path.join(__dirname, '..', '..', 'public', 'OTP.html');


        let emailHtml = await fs.readFile(templatePath, 'utf-8')

        emailHtml = emailHtml.replace('[User Name]', email)
        emailHtml = emailHtml.replace('[Verification Code]', otp)

        const encrypted = await this.encryptService.encrypt(email)
        const dycrypted = await this.encryptService.decrypt(encrypted)
        await this.mailerService.sendMail({
            to: email, // List of receivers email address
            from: 'noreply@findtute.com', // Senders email address
            subject: 'FindTute email verification code', // Subject line
            html: emailHtml, // HTML body content
        })
            .then((success) => {
                console.log("Verification email sent successfully:", success)
            })
            .catch((err) => {
                console.log("Verification email not sent:", err)
            });

        return {
            otp: otp,
            decryptData: dycrypted,
        }
    }

    async sendMail(email: string) {
        const encrypted = await this.encryptService.encrypt(email)
        const url = `https://localhost:3500/${encrypted}`
        const dycrypted = await this.encryptService.decrypt(encrypted)
        await this.mailerService.sendMail({
            to: email, // List of receivers email address
            from: 'teachu@info.com', // Senders email address
            subject: 'Password reset link', // Subject line
            html: `<p><b>Please do not reply to this message.</b> This is the link to reset your password, this link will expired in 30 minutes.</p>
               <br>Click this link to rest the password:</br>
               <br>
               <a href=${url}>
                 ${url}
               </a>
               </br>`, // HTML body content
        })
            .then((success) => {
                console.log("Success:", success)
            })
            .catch((err) => {
                console.log("ERROR AYA HA:", err)
            });

        return {
            url: url,
            decryptData: dycrypted,
        }
    }

    async sendOTP(email: string, otp: string) {
        const currentTime = new Date().getTime()
        const user = await this.findOneByEmail(email)
        const expiry = user.expiry_otp
        const dbOtp = user.otp
        if (expiry >= currentTime) {
            if (otp === dbOtp) {
                return await this.userRepo.save(user)
            }
            else {
                throw new BadRequestException("OTP is incorrect")
            }
        } else {
            throw new BadRequestException("OTP Expired")
        }
    }
}
