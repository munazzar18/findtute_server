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
exports.DashboardService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../user/user.entity");
const typeorm_2 = require("typeorm");
const grade_entity_1 = require("../grade/grade.entity");
const subjects_entity_1 = require("../subjects/subjects.entity");
let DashboardService = class DashboardService {
    constructor(userRepo, gradeRepo, subjectRepo) {
        this.userRepo = userRepo;
        this.gradeRepo = gradeRepo;
        this.subjectRepo = subjectRepo;
    }
    async dashboard() {
        const users = await this.userRepo.find();
        const usersCount = users.length;
        const teachers = users.filter(user => user.roles === 'teacher');
        const teachersCount = teachers.length;
        const students = users.filter(user => user.roles === 'student');
        const studentsCount = students.length;
        const parents = users.filter(user => user.roles === 'parent');
        const parentsCount = parents.length;
        const grades = await this.gradeRepo.find();
        const gradesCount = grades.length;
        const subjects = await this.subjectRepo.find();
        const subjectsCount = subjects.length;
        return {
            usersCount,
            teachersCount,
            studentsCount,
            parentsCount,
            gradesCount,
            subjectsCount
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(grade_entity_1.GradeEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(subjects_entity_1.SubjectsEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map