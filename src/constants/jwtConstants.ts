import * as dotenv from 'dotenv';
dotenv.config();

export const JwtConstants = {
    secret: process.env.JWT_SECRET
}