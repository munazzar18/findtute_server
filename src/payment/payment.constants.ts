import * as fs from 'fs';
import * as path from 'path';

import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
    envFilePath: ['.env', '.env.development', 'env.production']
})

const privateKeyPath = path.join(process.cwd(), 'keys', 'findtute-easypaisa-privatekey.pem');
const publicKeyPath = path.join(process.cwd(), 'keys', 'findtute-publickey.pem');

export const PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf8');
export const EASYPAISA_PUBLIC_KEY = fs.readFileSync(publicKeyPath, 'utf8');


// export const PRIVATE_KEY = process.env.PRIVATE_KEY;
// export const EASYPAISA_PUBLIC_KEY = process.env.PUBLIC_KEY;