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