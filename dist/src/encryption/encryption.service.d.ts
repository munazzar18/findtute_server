export declare class EncryptionService {
    encrypt(textToEncrypt: string): Promise<string>;
    decrypt(encryptedText: string): Promise<string>;
    encryptRequestHash(formData: any): string;
}
