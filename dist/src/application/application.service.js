"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const application_entity_1 = require("./application.entity");
const typeorm_2 = require("typeorm");
const helpers_1 = require("../helpers/helpers");
const bcrypt_1 = require("../auth/bcrypt");
let ApplicationService = class ApplicationService {
    constructor(applicationRepo) {
        this.applicationRepo = applicationRepo;
    }
    async findAll() {
        return await this.applicationRepo.find();
    }
    async findOneById(id) {
        return await this.applicationRepo.findOneBy({ id });
    }
    async findOneByUserId(id) {
        return await this.applicationRepo.findOneBy({ user_id: id });
    }
    async create(application, authUser) {
        const user = await this.findOneByUserId(authUser.id);
        if (!user) {
            throw new Error('User not found');
        }
        const paymentHash = authUser.is_authorized;
        const token = authUser.first_name + authUser.last_name + authUser.email + authUser.id;
        const isTokenValid = (0, bcrypt_1.compareToken)(token, paymentHash);
        if (!isTokenValid) {
            throw new Error('Invalid payment token');
        }
        let randName;
        let isUnique = false;
        while (!isUnique) {
            randName = (0, helpers_1.generateRandomString)(17);
            const appExists = await this.applicationRepo.findOne({ where: { name: randName } });
            if (!appExists) {
                isUnique = true;
            }
        }
        return await this.applicationRepo.save({
            name: randName,
            preference: authUser.preference,
            grades: authUser.grades,
            subjects: authUser.subjects,
            user_id: authUser.id,
            avatar: authUser.avatar,
            hourly_rate: authUser.hourly_rate,
            monthly_rate: authUser.monthly_rate,
            lattitude: authUser.lattitude,
            longitude: authUser.longitude,
            ...application
        });
    }
};
exports.ApplicationService = ApplicationService;
exports.ApplicationService = ApplicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(application_entity_1.ApplicationEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ApplicationService);
//# sourceMappingURL=application.service.js.map