
import * as crypto from 'crypto';
import * as CryptoJS from 'crypto-js';

import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
    envFilePath: ['.env', '.env.development', 'env.production']
})

const clientSecretKey = process.env.SECRET_KEY



export const sendJson = (status: boolean, message: string, data?: any) => {
    return {
        status: status,
        message: message,
        data: data
    }
}

export const generateOtp = async () => {
    const OTP = Math.floor(100000 + Math.random() * 900000).toString()
    const currentTime = new Date().getTime()
    const expiryTime = currentTime + 180000
    return {
        OTP,
        expiryTime
    }
}


export const generateRandomString = (length: number) => {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const charactersLength = characters.length

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    return result
}

export function generateHash(fields: Record<string, string>, secretKey: string): string {
    // Sort keys in alphabetical order
    const sortedKeys = Object.keys(fields).sort();

    // Create the data string
    const dataString = sortedKeys
        .map((key) => `${key}=${fields[key]}`)
        .join('&');

    // Encrypt using AES/ECB/PKCS5Padding
    const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(secretKey), null);
    let encrypted = cipher.update(dataString, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return encrypted;
}

export function switchHash(customerTransacionId: string, item: string, amount: number) {

    const stringToHash = `Swich:${customerTransacionId}:${item}:${amount}`
    const hmac = crypto.createHmac('sha256', clientSecretKey)
    hmac.update(stringToHash)
    const checkSum = hmac.digest('hex')
    return checkSum
}

export function generateEncryptedHash(payload: object, secretKey: string): string {
    try {
        // Convert the payload to a JSON string
        const jsonString = JSON.stringify(payload);

        // Ensure the secretKey is valid
        // if (secretKey.length !== 32) {
        //     throw new Error('Secret key must be 32 characters long.');
        // }

        // Create the encryption key and IV
        const key = CryptoJS.enc.Utf8.parse(secretKey);
        const iv = CryptoJS.enc.Utf8.parse(secretKey.slice(0, 16)); // First 16 bytes as IV

        // Encrypt the payload
        const encrypted = CryptoJS.AES.encrypt(jsonString, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        // Return the encrypted string
        return encrypted.toString();
    } catch (error) {
        console.error('Error generating encrypted hash:', error.message);
        throw error;
    }
}


