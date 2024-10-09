"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectsModule = void 0;
const common_1 = require("@nestjs/common");
const subjects_controller_1 = require("./subjects.controller");
const subjects_service_1 = require("./subjects.service");
const typeorm_1 = require("@nestjs/typeorm");
const subjects_entity_1 = require("./subjects.entity");
const jwt_1 = require("@nestjs/jwt");
const jwtConstants_1 = require("../constants/jwtConstants");
const user_entity_1 = require("../user/user.entity");
const user_service_1 = require("../user/user.service");
const encryption_service_1 = require("../encryption/encryption.service");
const grade_entity_1 = require("../grade/grade.entity");
let SubjectsModule = class SubjectsModule {
};
exports.SubjectsModule = SubjectsModule;
exports.SubjectsModule = SubjectsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: jwtConstants_1.JwtConstants.secret
            }),
            typeorm_1.TypeOrmModule.forFeature([subjects_entity_1.SubjectsEntity, user_entity_1.UserEntity, grade_entity_1.GradeEntity])
        ],
        exports: [subjects_service_1.SubjectsService],
        controllers: [subjects_controller_1.SubjectsController],
        providers: [subjects_service_1.SubjectsService, user_service_1.UserService, encryption_service_1.EncryptionService]
    })
], SubjectsModule);
//# sourceMappingURL=subjects.module.js.map