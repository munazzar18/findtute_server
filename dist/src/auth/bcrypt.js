"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodedPass = encodedPass;
exports.comparePass = comparePass;
exports.encodedToken = encodedToken;
exports.compareToken = compareToken;
const bcrypt = require("bcrypt");
function encodedPass(rawPassword) {
    const SALT = bcrypt.genSaltSync();
    return bcrypt.hashSync(rawPassword, SALT);
}
function comparePass(rawPassword, hash) {
    return bcrypt.compareSync(rawPassword, hash);
}
function encodedToken(token) {
    const SALT = bcrypt.genSaltSync();
    return bcrypt.hashSync(token, SALT);
}
function compareToken(token, hash) {
    return bcrypt.compareSync(token, hash);
}
//# sourceMappingURL=bcrypt.js.map