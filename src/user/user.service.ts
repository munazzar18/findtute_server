import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository, In, Not } from 'typeorm';
import { RegisterUserDto } from './registerUser.dto';
import { MailerService } from '@nestjs-modules/mailer';
// import { Twilio } from 'twilio';
import { EncryptionService } from 'src/encryption/encryption.service';
import * as path from 'path';
import { promises as fs } from 'fs';
import { UpdateUserProfileDto } from './updateUserProfile.dto';
import { SubjectsEntity } from 'src/subjects/subjects.entity';
import { GradeEntity } from 'src/grade/grade.entity';
import { Role } from 'src/roles/role.enum';


@Injectable()
export class UserService {
    // private twilioClient: Twilio;
    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        @InjectRepository(SubjectsEntity) private subjectRepo: Repository<SubjectsEntity>,
        @InjectRepository(GradeEntity) private gradeRepo: Repository<GradeEntity>,
        private readonly mailerService: MailerService,
        private readonly encryptService: EncryptionService
    ) { }

    async findAll() {
        return await this.userRepo.find()
    }

    async findAllUsers(userId: string, page: number) {

        const limit: number = 10;
        const skip: number = (page - 1) * limit

        const userData = await this.findOneById(userId)
        let data: [UserEntity[], number]
        if (userData.roles === Role.Teacher) {
            data = await this.userRepo.findAndCount({
                where: {
                    id: Not(userId),
                    roles: Role.Student
                },
                order: {
                    id: 'ASC'
                },

                skip: skip,
                take: (page * limit),
                relations: ['grades', 'subjects']
            })
        } else {
            data = await this.userRepo.findAndCount({
                where: {
                    id: Not(userId),
                    roles: Role.Teacher
                },
                order: {
                    id: 'ASC'
                },
                skip: skip,
                take: (page * limit),
                relations: ['grades', 'subjects']
            })
        }

        return {
            data: data[0],
            pageData: {
                total: data[1],
                perPage: limit,
                currentPage: Number(page),
                totalPages: Math.ceil(data[1] / limit),
            }
        }
    }

    async findMatching(userId: string) {
        const userData = await this.findOneById(userId)

        const data = await this.userRepo.find({
            where: {
                id: Not(userId),
                preference: userData.preference,

            },
            relations: ['grades', 'subjects']
        })

        return data
    }

    async findOneById(id: string) {
        const users = await this.userRepo.findOne({
            where: {
                id: id
            },
            relations: ['grades', 'subjects']
        })
        return users
    }

    async findOneByEmail(email: string) {
        try {
            return await this.userRepo.findOneBy({ email })

        } catch (error) {
            throw new Error(error)
        }
    }

    async updateUser(id: string, updateData: Partial<UserEntity>) {
        return await this.userRepo.update(id, updateData)
    }

    async getGradesForUser(userId: string) {
        try {
            const grades = await this.gradeRepo.find({
                where: {
                    users: {
                        id: userId
                    }
                }
            })

            if (!grades) {
                throw new Error('Grades not found')
            }

            return grades

        } catch (error) {
            throw new Error(`Failed to get grades for user: ${error}`);
        }
    }

    async getSubjectsForUser(userId: string) {
        try {
            const subjects = await this.subjectRepo.find({
                where: {
                    users: {
                        id: userId
                    }
                }
            })

            if (!subjects) {
                throw new Error('Subjects not found')
            }

            return subjects

        } catch (error) {
            throw new Error(`Failed to get subjects for user: ${error}`);
        }
    }

    async updateUserProfile(id: string, updateData: UpdateUserProfileDto, authUser: UserEntity) {
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
                where: { id: In(updateData.subjects_ids) }
            });

            const grades = await this.gradeRepo.find({
                where: { id: In(updateData.grades_ids) }
            });


            getUser.grades = grades
            getUser.subjects = subjects

            const updatedUser = await this.userRepo.save({
                ...getUser,
                ...updateData,
                is_active: getUser.is_active,
                is_deleted: getUser.is_deleted,
                is_verified: true,
                is_online: getUser.is_online,
                is_Authorized: getUser.is_authorized,
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
        // const templatePath = path.join(__dirname, '..', '..', 'public', 'OTP.html');
        const templatePath = path.join(process.cwd(), 'public', 'OTP.html');


        let emailHtml = await fs.readFile(templatePath, 'utf-8')

        emailHtml = emailHtml.replace('[User Name]', email)
        emailHtml = emailHtml.replace('[Verification Code]', otp)

        const encrypted = await this.encryptService.encrypt(email)
        const dycrypted = await this.encryptService.decrypt(encrypted)
        await this.mailerService.sendMail({
            to: email,
            from: 'noreply@findtute.com',
            subject: 'FindTute email verification code',
            html: emailHtml,
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

    async sendMail(email: string, otp: string) {

        // const templatePath = path.join(__dirname, '..', '..', 'public', 'forgotPassword.html');
        const templatePath = path.join(process.cwd(), 'public', 'forgotPassword.html');

        let emailHtml = await fs.readFile(templatePath, 'utf-8')

        const encrypted = await this.encryptService.encrypt(email)
        const frontUrl = process.env.FORGOT_PASSWORD_URl
        const url = `${frontUrl}/${encrypted}`
        const dycrypted = await this.encryptService.decrypt(encrypted)

        emailHtml = emailHtml.replace('[User Name]', email)
        emailHtml = emailHtml.replace('[Verification Code]', otp)
        emailHtml = emailHtml.replace('[Verification Link]', url)

        await this.mailerService.sendMail({
            to: email,
            from: 'noreply@findtute.com',
            subject: 'Password reset link',
            html: emailHtml,
        })
            .then((success) => {
                console.log("Verification email sent successfully:", success)
            })
            .catch((err) => {
                console.log("Verification email not sent:", err)
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

    async resendOTPMail(email: string, otp: string) {
        // const templatePath = path.join(__dirname, '..', '..', 'public', 'ResendOTP.html');
        const templatePath = path.join(process.cwd(), 'public', 'ResendOTP.html');


        let emailHtml = await fs.readFile(templatePath, 'utf-8')

        emailHtml = emailHtml.replace('[User Name]', email)
        emailHtml = emailHtml.replace('[Verification Code]', otp)

        const encrypted = await this.encryptService.encrypt(email)
        const dycrypted = await this.encryptService.decrypt(encrypted)
        await this.mailerService.sendMail({
            to: email,
            from: 'noreply@findtute.com',
            subject: 'FindTute email verification code',
            html: emailHtml,
        })
            .then((success) => {
                console.log("One time password is sent successfully:", success)
            })
            .catch((err) => {
                console.log("One time password is not sent:", err)
            });

        return {
            otp: otp,
            decryptData: dycrypted,
        }
    }

}
