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
exports.GradeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const grade_entity_1 = require("./grade.entity");
const user_entity_1 = require("../user/user.entity");
let GradeService = class GradeService {
    constructor(gradeRepo, UserRepo) {
        this.gradeRepo = gradeRepo;
        this.UserRepo = UserRepo;
    }
    async findAll(page) {
        const limit = 10;
        const skip = (page - 1) * limit;
        try {
            const [grades, total] = await this.gradeRepo.findAndCount({
                order: {
                    id: 'ASC'
                },
                skip: skip,
                take: (page * limit)
            });
            const totalPages = Math.ceil(total / limit);
            return {
                data: grades,
                pageData: {
                    total,
                    perPage: limit,
                    currentPage: Number(page),
                    lastPage: totalPages
                }
            };
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
    async findOneById(id) {
        try {
            return await this.gradeRepo.findOneBy({ id });
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
    async findOneByuserId(userId) {
        try {
            return await this.gradeRepo.findOneBy({ id: userId });
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
    async create(grade) {
        try {
            const createGrade = this.gradeRepo.create({
                ...grade,
            });
            const savedGrade = await this.gradeRepo.save(createGrade);
            return savedGrade;
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
    async update(id, updateData) {
        try {
            const grade = await this.gradeRepo.findOne({
                where: {
                    id
                }
            });
            if (!grade) {
                return new Error('Grade not found');
            }
            Object.assign(grade, updateData);
            const updatedGrade = await this.gradeRepo.save(grade);
            return updatedGrade;
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
    async delete(id) {
        try {
            const grade = await this.gradeRepo.findOne({ where: { id } });
            if (!grade) {
                return new Error('Grade not found');
            }
            await this.gradeRepo.delete(id);
            return { message: 'Grade deleted successfully' };
        }
        catch (error) {
            console.error(error);
            return error;
        }
    }
};
exports.GradeService = GradeService;
exports.GradeService = GradeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(grade_entity_1.GradeEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], GradeService);
//# sourceMappingURL=grade.service.js.map