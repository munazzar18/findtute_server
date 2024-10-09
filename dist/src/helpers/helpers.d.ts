export declare const sendJson: (status: boolean, message: string, data?: any) => {
    status: boolean;
    message: string;
    data: any;
};
export declare const generateOtp: () => Promise<{
    OTP: string;
    expiryTime: number;
}>;
export declare const generateRandomString: (length: number) => string;
