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
exports.InititateCheckoutDto = exports.initiateHandshakeDTO = exports.HandshakeDto = void 0;
const class_validator_1 = require("class-validator");
class HandshakeDto {
}
exports.HandshakeDto = HandshakeDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], HandshakeDto.prototype, "orderId", void 0);
class initiateHandshakeDTO {
}
exports.initiateHandshakeDTO = initiateHandshakeDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], initiateHandshakeDTO.prototype, "HS_RequestHash", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], initiateHandshakeDTO.prototype, "HS_ChannelId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], initiateHandshakeDTO.prototype, "HS_ReturnURL", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], initiateHandshakeDTO.prototype, "HS_MerchantId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], initiateHandshakeDTO.prototype, "HS_StoreId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], initiateHandshakeDTO.prototype, "HS_MerchantHash", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], initiateHandshakeDTO.prototype, "HS_MerchantUsername", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], initiateHandshakeDTO.prototype, "HS_MerchantPassword", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], initiateHandshakeDTO.prototype, "HS_TransactionReferenceNumber", void 0);
class InititateCheckoutDto {
}
exports.InititateCheckoutDto = InititateCheckoutDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], InititateCheckoutDto.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InititateCheckoutDto.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InititateCheckoutDto.prototype, "returnUrl", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InititateCheckoutDto.prototype, "requestHash", void 0);
//# sourceMappingURL=initiateHandshakeDto.dto.js.map