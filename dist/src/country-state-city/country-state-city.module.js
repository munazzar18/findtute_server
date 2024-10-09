"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryStateCityModule = void 0;
const common_1 = require("@nestjs/common");
const country_state_city_controller_1 = require("./country-state-city.controller");
const country_state_city_service_1 = require("./country-state-city.service");
let CountryStateCityModule = class CountryStateCityModule {
};
exports.CountryStateCityModule = CountryStateCityModule;
exports.CountryStateCityModule = CountryStateCityModule = __decorate([
    (0, common_1.Module)({
        controllers: [country_state_city_controller_1.CountryStateCityController],
        providers: [country_state_city_service_1.CountryStateCityService]
    })
], CountryStateCityModule);
//# sourceMappingURL=country-state-city.module.js.map