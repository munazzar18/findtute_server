"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const util_1 = require("util");
const CryptoJS = require("crypto-js");
let EncryptionService = class EncryptionService {
    async encrypt(textToEncrypt) {
        const iv = (0, crypto_1.randomBytes)(16);
        const password = process.env.ENCRYPTED_KEY;
        const key = (await (0, util_1.promisify)(crypto_1.scrypt)(password, 'salt', 32));
        const cipher = (0, crypto_1.createCipheriv)('aes-256-ctr', key, iv);
        const encryptedText = Buffer.concat([
            cipher.update(textToEncrypt),
            cipher.final(),
        ]);
        const result = Buffer.concat([iv, encryptedText]);
        return result.toString('base64url');
    }
    async decrypt(encryptedText) {
        const password = process.env.ENCRYPTED_KEY;
        const encryptedBuffer = Buffer.from(encryptedText, 'base64url');
        const iv = encryptedBuffer.slice(0, 16);
        const encryptedText2 = encryptedBuffer.slice(16);
        const key = (await (0, util_1.promisify)(crypto_1.scrypt)(password, 'salt', 32));
        const decipher = (0, crypto_1.createDecipheriv)('aes-256-ctr', key, iv);
        const decryptedText = Buffer.concat([
            decipher.update(encryptedText2),
            decipher.final(),
        ]);
        return decryptedText.toString('utf-8');
    }
    encryptRequestHash(formData) {
        let mapString = '';
        for (const [key, value] of Object.entries(formData)) {
            if (key !== 'HS_RequestHash' && key !== 'Key1' && key !== 'Key2') {
                mapString += `${key}=${value}&`;
            }
        }
        mapString = mapString.slice(0, -1);
        const key1 = CryptoJS.enc.Utf8.parse(formData.Key1);
        const key2 = CryptoJS.enc.Utf8.parse(formData.Key2);
        const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(mapString), key1, {
            iv: key2,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return encrypted.toString();
    }
};
exports.EncryptionService = EncryptionService;
exports.EncryptionService = EncryptionService = __decorate([
    (0, common_1.Injectable)()
], EncryptionService);
//# sourceMappingURL=encryption.service.js.map