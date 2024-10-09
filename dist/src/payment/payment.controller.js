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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const initiateHandshakeDto_dto_1 = require("./initiateHandshakeDto.dto");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async handshake(data) {
        return await this.paymentService.handShake(data.orderId);
    }
    async initiateHandshake(data) {
        return await this.paymentService.initiateHandshake(data);
    }
    async initiateCheckout(data) {
        return await this.paymentService.initiateCheckout(data);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('handshake'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [initiateHandshakeDto_dto_1.HandshakeDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "handshake", null);
__decorate([
    (0, common_1.Post)('initiateHandshake'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [initiateHandshakeDto_dto_1.HandshakeDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "initiateHandshake", null);
__decorate([
    (0, common_1.Post)('checkout'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [initiateHandshakeDto_dto_1.InititateCheckoutDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "initiateCheckout", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map