import * as bcrypt from 'bcrypt'

export function encodedPass(rawPassword: string) {
    const SALT = bcrypt.genSaltSync()
    return bcrypt.hashSync(rawPassword, SALT)
}

export function comparePass(rawPassword: string, hash: string) {
    return bcrypt.compareSync(rawPassword, hash)
}


export function encodedToken(token: string) {
    const SALT = bcrypt.genSaltSync()
    return bcrypt.hashSync(token, SALT)
}


export function compareToken(token: string, hash: string) {
    return bcrypt.compareSync(token, hash)
}