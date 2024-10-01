import { Injectable } from '@nestjs/common';
import { City, Country, State } from 'country-state-city';

@Injectable()
export class CountryStateCityService {


    async getAllCountries() {
        return Country.getAllCountries();
    }

    async getStatesOfCountry(countryCode: string) {
        try {
            return State.getStatesOfCountry(countryCode);
        } catch (error) {
            throw new Error(error)
        }
    }

    async getCitiesOfState(countryCode: string, stateCode: string) {
        try {
            return City.getCitiesOfState(countryCode, stateCode);
        } catch (error) {
            throw new Error(error)
        }
    }

}
