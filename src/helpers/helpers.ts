
import * as crypto from 'crypto';


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


