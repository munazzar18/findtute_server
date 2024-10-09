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
exports.SubjectsController = void 0;
const common_1 = require("@nestjs/common");
const subjects_service_1 = require("./subjects.service");
const helpers_1 = require("../helpers/helpers");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/auth.guard");
const role_guard_1 = require("../roles/role.guard");
const role_decorator_1 = require("../roles/role.decorator");
const role_enum_1 = require("../roles/role.enum");
const subjects_dto_1 = require("./subjects.dto");
let SubjectsController = class SubjectsController {
    constructor(subjectService) {
        this.subjectService = subjectService;
    }
    async findAll() {
        try {
            const allSubjects = await this.subjectService.findAll();
            return (0, helpers_1.sendJson)(true, 'All subjects', allSubjects);
        }
        catch (error) {
            return (0, helpers_1.sendJson)(false, 'Failed to get all subjects', error);
        }
    }
    async findOneById(id) {
        try {
            const subject = await this.subjectService.findOneById(id);
            return (0, helpers_1.sendJson)(true, 'Subject by id fetched', subject);
        }
        catch (error) {
            return (0, helpers_1.sendJson)(false, 'Failed to get subject by id', error);
        }
    }
    async findOneBySubject(subject) {
        try {
            const BySubject = await this.subjectService.findOneBySubject(subject);
            return (0, helpers_1.sendJson)(true, 'Subject by subject fetched', BySubject);
        }
        catch (error) {
            return (0, helpers_1.sendJson)(false, 'Failed to get subject by subject', error);
        }
    }
    async create(data) {
        try {
            const createSubject = await this.subjectService.create(data);
            return (0, helpers_1.sendJson)(true, 'Subject created successfully', createSubject);
        }
        catch (error) {
            return (0, helpers_1.sendJson)(false, 'Failed to create subject', error);
        }
    }
    async update(id, updateData) {
        try {
            const subject = await this.subjectService.findOneById(id);
            if (!subject) {
                return (0, helpers_1.sendJson)(false, 'Subject not found', null);
            }
            const updatedSubject = await this.subjectService.update(id, updateData);
            return (0, helpers_1.sendJson)(true, 'Subject updated successfully', updatedSubject);
        }
        catch (error) {
            return (0, helpers_1.sendJson)(false, 'Failed to update subject', error);
        }
    }
    async delete(id) {
        try {
            const result = await this.subjectService.delete(id);
            return (0, helpers_1.sendJson)(true, 'Subject deleted successfully', result);
        }
        catch (error) {
            return (0, helpers_1.sendJson)(false, 'Failed to delete subject', error);
        }
    }
};
exports.SubjectsController = SubjectsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/id/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubjectsController.prototype, "findOneById", null);
__decorate([
    (0, common_1.Get)('/subject/:subject'),
    __param(0, (0, common_1.Param)('subject')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubjectsController.prototype, "findOneBySubject", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subjects_dto_1.SubjectsDto]),
    __metadata("design:returntype", Promise)
], SubjectsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, common_1.Put)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubjectsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, common_1.Delete)('/id/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubjectsController.prototype, "delete", null);
exports.SubjectsController = SubjectsController = __decorate([
    (0, common_1.Controller)('subjects'),
    (0, swagger_1.ApiTags)('subjects'),
    __metadata("design:paramtypes", [subjects_service_1.SubjectsService])
], SubjectsController);
//# sourceMappingURL=subjects.controller.js.map