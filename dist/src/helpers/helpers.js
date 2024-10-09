"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomString = exports.generateOtp = exports.sendJson = void 0;
const sendJson = (status, message, data) => {
    return {
        status: status,
        message: message,
        data: data
    };
};
exports.sendJson = sendJson;
const generateOtp = async () => {
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const currentTime = new Date().getTime();
    const expiryTime = currentTime + 180000;
    return {
        OTP,
        expiryTime
    };
};
exports.generateOtp = generateOtp;
const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.generateRandomString = generateRandomString;
//# sourceMappingURL=helpers.js.map