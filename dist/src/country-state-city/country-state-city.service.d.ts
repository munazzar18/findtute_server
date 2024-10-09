export declare class CountryStateCityService {
    getAllCountries(): Promise<import("country-state-city").ICountry[]>;
    getStatesOfCountry(countryCode: string): Promise<import("country-state-city").IState[]>;
    getCitiesOfState(countryCode: string, stateCode: string): Promise<import("country-state-city").ICity[]>;
}
