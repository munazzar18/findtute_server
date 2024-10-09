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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationEntity = void 0;
const user_entity_1 = require("../user/user.entity");
const typeorm_1 = require("typeorm");
let ApplicationEntity = class ApplicationEntity {
};
exports.ApplicationEntity = ApplicationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ApplicationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], ApplicationEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], ApplicationEntity.prototype, "hourly_rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], ApplicationEntity.prototype, "monthly_rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], ApplicationEntity.prototype, "lattitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], ApplicationEntity.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], ApplicationEntity.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], ApplicationEntity.prototype, "preference", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'text', array: true }),
    __metadata("design:type", Array)
], ApplicationEntity.prototype, "grades", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'text', array: true }),
    __metadata("design:type", Array)
], ApplicationEntity.prototype, "subjects", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ApplicationEntity.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ApplicationEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ApplicationEntity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.UserEntity, (user) => user.application),
    __metadata("design:type", user_entity_1.UserEntity)
], ApplicationEntity.prototype, "user", void 0);
exports.ApplicationEntity = ApplicationEntity = __decorate([
    (0, typeorm_1.Entity)()
], ApplicationEntity);
//# sourceMappingURL=application.entity.js.map