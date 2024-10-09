"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtConstants = void 0;
const config_1 = require("@nestjs/config");
config_1.ConfigModule.forRoot({
    envFilePath: ['.env', '.env.development', 'env.production']
});
exports.JwtConstants = {
    secret: process.env.JWT_SECRET
};
//# sourceMappingURL=jwtConstants.js.map