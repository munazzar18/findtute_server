
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


