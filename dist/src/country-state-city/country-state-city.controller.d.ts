import { CountryStateCityService } from './country-state-city.service';
export declare class CountryStateCityController {
    private locService;
    constructor(locService: CountryStateCityService);
    getAllCountries(): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    getStatesOfCountry(countryCode: string): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    getCitiesOfState(countryCode: string, stateCode: string): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
}
