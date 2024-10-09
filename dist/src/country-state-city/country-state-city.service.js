"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryStateCityService = void 0;
const common_1 = require("@nestjs/common");
const country_state_city_1 = require("country-state-city");
let CountryStateCityService = class CountryStateCityService {
    async getAllCountries() {
        return country_state_city_1.Country.getAllCountries();
    }
    async getStatesOfCountry(countryCode) {
        try {
            return country_state_city_1.State.getStatesOfCountry(countryCode);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getCitiesOfState(countryCode, stateCode) {
        try {
            return country_state_city_1.City.getCitiesOfState(countryCode, stateCode);
        }
        catch (error) {
            throw new Error(error);
        }
    }
};
exports.CountryStateCityService = CountryStateCityService;
exports.CountryStateCityService = CountryStateCityService = __decorate([
    (0, common_1.Injectable)()
], CountryStateCityService);
//# sourceMappingURL=country-state-city.service.js.map