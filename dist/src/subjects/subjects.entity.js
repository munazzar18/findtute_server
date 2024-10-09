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
exports.SubjectsEntity = void 0;
const user_entity_1 = require("../user/user.entity");
const typeorm_1 = require("typeorm");
let SubjectsEntity = class SubjectsEntity {
};
exports.SubjectsEntity = SubjectsEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SubjectsEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], SubjectsEntity.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], SubjectsEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.UserEntity, (user) => user.subjects),
    (0, typeorm_1.JoinTable)({
        name: 'user_subjects',
        joinColumn: {
            name: 'subject_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        }
    }),
    __metadata("design:type", Array)
], SubjectsEntity.prototype, "users", void 0);
exports.SubjectsEntity = SubjectsEntity = __decorate([
    (0, typeorm_1.Entity)()
], SubjectsEntity);
//# sourceMappingURL=subjects.entity.js.map