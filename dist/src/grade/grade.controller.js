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
exports.GradeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const grade_service_1 = require("./grade.service");
const grade_dto_1 = require("./grade.dto");
const auth_guard_1 = require("../auth/auth.guard");
const role_guard_1 = require("../roles/role.guard");
const role_decorator_1 = require("../roles/role.decorator");
const role_enum_1 = require("../roles/role.enum");
const helpers_1 = require("../helpers/helpers");
let GradeController = class GradeController {
    constructor(gradeService) {
        this.gradeService = gradeService;
    }
    async findAll(page) {
        return await this.gradeService.findAll(page);
    }
    async findOneById(id) {
        const grade = await this.gradeService.findOneById(id);
        return (0, helpers_1.sendJson)(true, 'Grade by id fetched', grade);
    }
    async findOneByuserId(userId) {
        return await this.gradeService.findOneByuserId(userId);
    }
    async create(grade) {
        try {
            const createGrade = await this.gradeService.create(grade);
            return (0, helpers_1.sendJson)(true, 'Grade created successfully', createGrade);
        }
        catch (error) {
            return (0, helpers_1.sendJson)(false, 'Failed to create grade', error);
        }
    }
    async update(id, updateData) {
        try {
            const updatedGrade = await this.gradeService.update(id, updateData);
            return (0, helpers_1.sendJson)(true, 'Grade updated successfully', updatedGrade);
        }
        catch (error) {
            return (0, helpers_1.sendJson)(false, 'Failed to update grade', error);
        }
    }
    async delete(id) {
        try {
            const result = await this.gradeService.delete(id);
            return (0, helpers_1.sendJson)(true, 'Grade deleted successfully', result);
        }
        catch (error) {
            return (0, helpers_1.sendJson)(false, 'Failed to delete grade', error);
        }
    }
};
exports.GradeController = GradeController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GradeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/id/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GradeController.prototype, "findOneById", null);
__decorate([
    (0, common_1.Get)('/profile/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GradeController.prototype, "findOneByuserId", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [grade_dto_1.CreateGradeDTO]),
    __metadata("design:returntype", Promise)
], GradeController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GradeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/id/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GradeController.prototype, "delete", null);
exports.GradeController = GradeController = __decorate([
    (0, common_1.Controller)('grade'),
    (0, swagger_1.ApiTags)('grade'),
    __metadata("design:paramtypes", [grade_service_1.GradeService])
], GradeController);
//# sourceMappingURL=grade.controller.js.map