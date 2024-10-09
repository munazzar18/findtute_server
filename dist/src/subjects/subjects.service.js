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
exports.SubjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const subjects_entity_1 = require("./subjects.entity");
const typeorm_2 = require("typeorm");
let SubjectsService = class SubjectsService {
    constructor(subjectRepo) {
        this.subjectRepo = subjectRepo;
    }
    async findAll() {
        return await this.subjectRepo.find();
    }
    async findOneById(id) {
        return await this.subjectRepo.findOneBy({ id });
    }
    async findOneBySubject(subject) {
        return await this.subjectRepo.findOneBy({ subject });
    }
    async create(data) {
        try {
            const createSubject = this.subjectRepo.create({
                ...data
            });
            const savedSubject = await this.subjectRepo.save(createSubject);
            return savedSubject;
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
    async update(id, updateData) {
        try {
            const subject = await this.subjectRepo.findOne({
                where: { id }
            });
            if (!subject) {
                return new Error('Subject not found');
            }
            const updatedSubject = await this.subjectRepo.save({
                ...subject,
                ...updateData
            });
            return updatedSubject;
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
    async delete(id) {
        try {
            const subject = await this.subjectRepo.findOne({
                where: { id }
            });
            if (!subject) {
                return new Error('Subject not found');
            }
            const deletedSubject = await this.subjectRepo.remove(subject);
            return deletedSubject;
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
};
exports.SubjectsService = SubjectsService;
exports.SubjectsService = SubjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subjects_entity_1.SubjectsEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubjectsService);
//# sourceMappingURL=subjects.service.js.map