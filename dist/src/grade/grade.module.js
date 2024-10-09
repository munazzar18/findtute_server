"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeModule = void 0;
const common_1 = require("@nestjs/common");
const grade_controller_1 = require("./grade.controller");
const grade_service_1 = require("./grade.service");
const jwt_1 = require("@nestjs/jwt");
const jwtConstants_1 = require("../constants/jwtConstants");
const typeorm_1 = require("@nestjs/typeorm");
const grade_entity_1 = require("./grade.entity");
const user_service_1 = require("../user/user.service");
const user_entity_1 = require("../user/user.entity");
const encryption_service_1 = require("../encryption/encryption.service");
const subjects_entity_1 = require("../subjects/subjects.entity");
let GradeModule = class GradeModule {
};
exports.GradeModule = GradeModule;
exports.GradeModule = GradeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: jwtConstants_1.JwtConstants.secret
            }),
            typeorm_1.TypeOrmModule.forFeature([grade_entity_1.GradeEntity, user_entity_1.UserEntity, subjects_entity_1.SubjectsEntity])
        ],
        exports: [grade_service_1.GradeService],
        controllers: [grade_controller_1.GradeController],
        providers: [grade_service_1.GradeService, user_service_1.UserService, encryption_service_1.EncryptionService]
    })
], GradeModule);
//# sourceMappingURL=grade.module.js.map