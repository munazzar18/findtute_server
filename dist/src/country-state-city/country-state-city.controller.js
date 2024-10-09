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
exports.CountryStateCityController = void 0;
const common_1 = require("@nestjs/common");
const country_state_city_service_1 = require("./country-state-city.service");
const helpers_1 = require("../helpers/helpers");
let CountryStateCityController = class CountryStateCityController {
    constructor(locService) {
        this.locService = locService;
    }
    async getAllCountries() {
        try {
            const countries = await this.locService.getAllCountries();
            return (0, helpers_1.sendJson)(true, 'All countries', countries);
        }
        catch (error) {
            return (0, helpers_1.sendJson)(false, 'Failed to get all countries', error);
        }
    }
    async getStatesOfCountry(countryCode) {
        try {
            const states = await this.locService.getStatesOfCountry(countryCode);
            return (0, helpers_1.sendJson)(true, 'All states of country', states);
        }
        catch (error) {
            return (0, helpers_1.sendJson)(false, 'Failed to get states of country', error);
        }
    }
    async getCitiesOfState(countryCode, stateCode) {
        try {
            const cities = await this.locService.getCitiesOfState(countryCode, stateCode);
            return (0, helpers_1.sendJson)(true, 'All cities of state', cities);
        }
        catch (error) {
            return (0, helpers_1.sendJson)(false, 'Failed to get cities of state', error);
        }
    }
};
exports.CountryStateCityController = CountryStateCityController;
__decorate([
    (0, common_1.Get)('/countries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CountryStateCityController.prototype, "getAllCountries", null);
__decorate([
    (0, common_1.Get)('/states/:countryCode'),
    __param(0, (0, common_1.Param)('countryCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CountryStateCityController.prototype, "getStatesOfCountry", null);
__decorate([
    (0, common_1.Get)('/cities/:countryCode/:stateCode'),
    __param(0, (0, common_1.Param)('countryCode')),
    __param(1, (0, common_1.Param)('stateCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CountryStateCityController.prototype, "getCitiesOfState", null);
exports.CountryStateCityController = CountryStateCityController = __decorate([
    (0, common_1.Controller)('location'),
    __metadata("design:paramtypes", [country_state_city_service_1.CountryStateCityService])
], CountryStateCityController);
//# sourceMappingURL=country-state-city.controller.js.map