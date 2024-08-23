import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { comparePass, encodedPass } from './bcrypt';
import { UserEntity, serializedUser } from 'src/user/user.entity';
import { RegisterUserDto } from 'src/user/registerUser.dto';
import { generateOtp } from 'src/helpers/helpers';
// import { Twilio } from 'twilio';

@Injectable()
export class AuthService {
    // public twilioClient: Twilio;
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string) {
        const userDb = await this.userService.findOneByEmail(email)
        if (userDb) {
            const matched = comparePass(password, userDb.password)
            if (matched) {
                return new serializedUser(userDb)
            }
            else {
                throw new UnauthorizedException('Invalid Credentials')
            }
        }
        else {
            throw new UnauthorizedException('Invalid Credentials')
        }
    }

    async login(user: any) {
        const payload = {
            email: user.email,
            id: user.id,
            role: user.roles
        }
        const accessToken = this.jwtService.sign(payload);
        return {
            access_token: accessToken,
            user: {
                email: payload.email,
                id: payload.id,
                role: payload.role
            }
        }
    }

    // async generateOtp() {
    //     // const accountSid = process.env.TWILIO_SID
    //     // const authToken = process.env.TWILIO_AUTH_TOKEN
    //     // const client = this.twilioClient = new Twilio(accountSid, authToken);
    //     const OTP = Math.floor(100000 + Math.random() * 900000).toString()
    //     const currentTime = new Date().getTime()
    //     const expiryTime = currentTime + 180000
    //     // await client.messages
    //     //     .create({
    //     //         body: `Your confirmation code is ${OTP}`,
    //     //         from: process.env.TWILIO_NUMBER,
    //     //         to: mobile
    //     //     })
    //     return {
    //         OTP,
    //         expiryTime
    //     }
    // }

    async verifyOtp(email: string, otp: string) {
        const currentTime = new Date().getTime()
        const user = await this.userService.findOneByEmail(email)
        if (!user) {
            throw new BadRequestException("Invalid Credentials")
        }
        else {
            const expiry = user.expiry_otp
            const dbOtp = user.otp
            if (expiry >= currentTime) {
                if (otp === dbOtp) {

                    user.email_verified = true

                    await this.userService.updateUser(user.id, { email_verified: true });

                    const newUser = {
                        email: user.email,
                        id: user.id,
                        role: user.roles,
                        email_verified: user.email_verified
                    }
                    const accessToken = this.jwtService.sign(newUser)
                    return accessToken
                }
                else {
                    throw new BadRequestException("OTP is incorrect")
                }
            } else {
                throw new BadRequestException("OTP Expired")
            }
        }
    }

    async register(data: RegisterUserDto) {
        const userDb = await this.userService.findOneByEmail(data.email)
        if (userDb) {
            throw new HttpException('user with this email already exists', HttpStatus.CONFLICT)
        }
        else {
            const otp_service = await generateOtp()
            const otp = otp_service.OTP
            const expiry_otp = otp_service.expiryTime
            const password = encodedPass(data.password)
            const newUser = await this.userService.create({ ...data, password, otp, expiry_otp })
            await this.userService.sendOTPMail(data.email, otp)


            const payload = {
                email: newUser.email,
                id: newUser.id,
                role: newUser.roles,
                email_verified: newUser.email_verified
            }
            return payload
            const accessToken = this.jwtService.sign(payload);
            return {
                access_token: accessToken,
                user: {
                    email: payload.email,
                    id: payload.id,
                    role: payload.role
                }
            }


        }
    }

}
