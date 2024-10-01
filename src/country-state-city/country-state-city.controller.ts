import { Controller, Get, Param } from '@nestjs/common';
import { CountryStateCityService } from './country-state-city.service';
import { sendJson } from 'src/helpers/helpers';

@Controller('location')
export class CountryStateCityController {
    constructor(
        private locService: CountryStateCityService
    ) { }

    @Get('/countries')
    async getAllCountries() {
        try {
            const countries = await this.locService.getAllCountries()
            return sendJson(true, 'All countries', countries)
        } catch (error) {
            return sendJson(false, 'Failed to get all countries', error)
        }
    }

    @Get('/states/:countryCode')
    async getStatesOfCountry(@Param('countryCode') countryCode: string) {
        try {
            const states = await this.locService.getStatesOfCountry(countryCode)
            return sendJson(true, 'All states of country', states)
        } catch (error) {
            return sendJson(false, 'Failed to get states of country', error)
        }
    }

    @Get('/cities/:countryCode/:stateCode')
    async getCitiesOfState(@Param('countryCode') countryCode: string, @Param('stateCode') stateCode: string) {
        try {
            const cities = await this.locService.getCitiesOfState(countryCode, stateCode)
            return sendJson(true, 'All cities of state', cities)
        } catch (error) {
            return sendJson(false, 'Failed to get cities of state', error)
        }
    }
}
