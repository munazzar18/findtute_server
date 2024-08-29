import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
    envFilePath: ['.env.development', 'env.production']
})
export const JwtConstants = {
    secret: process.env.JWT_SECRET
}