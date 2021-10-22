import { Dispatch } from "react";
import IPData from "ipdata";
import {
    IConverterAction,
    IIpData,
    ICurrency,
    IRestCountry,
    ICurrencyOption,
} from "../types";

const ipdataco = process.env.REACT_APP_IPDATA_CO ?? '';

const currencyCountries: { [key: string]: string } = {
    CAD: 'CAN',
    HKD: 'HKG',
    ISK: 'ISL',
    PHP: 'PHL',
    DKK: 'DNK',
    HUF: 'HUN',
    CZK: 'CZE',
    AUD: 'AUS',
    RON: 'ROU',
    SEK: 'SWE',
    IDR: 'IDN',
    INR: 'IND',
    BRL: 'BRA',
    RUB: 'RUS',
    HRK: 'HRV',
    JPY: 'JPN',
    THB: 'THA',
    CHF: 'CHE',
    SGD: 'SGP',
    PLN: 'POL',
    BGN: 'BGR',
    TRY: 'TUR',
    CNY: 'CHN',
    NOK: 'NOR',
    NZD: 'NZL',
    ZAR: 'ZAF',
    USD: 'USA',
    MXN: 'MEX',
    ILS: 'ISR',
    GBP: 'GBR',
    KRW: 'KOR',
    MYR: 'MYS',
};

const fetchUserData = async (dispatch: Dispatch<IConverterAction>): Promise<void> => {
    const ipdata = new IPData(ipdataco);
    const data: IIpData = await ipdata?.lookup();

    if (data?.message) {
        console.warn(data.message);
    }

    dispatch({ type: 'SET_USER', payload: data });
};

const fetchCurrencies = async (
    dispatch: Dispatch<IConverterAction>
): Promise<void> => {
    let currencies: { [code: string]: number };
    let countries: ICurrency[] = [];

    try {
        const fetchRates = await fetch(
            'https://api.craigmcn.com/exchange-rates/v1/latest'
        );
        const fetchRatesJson = await fetchRates?.json();

        if (fetchRatesJson?.error) {
            throw new Error(fetchRatesJson?.error?.message);
        }
        currencies = fetchRatesJson?.rates;
        dispatch({ type: 'SET_TIMESTAMP', payload: fetchRatesJson?.timestamp });

        if (currencies) {
            const fetchCountries = await fetch(
                'https://restcountries.com/v3.1/all?fields=cca3,currencies,flag'
            );
            const fetchCountriesJson = await fetchCountries?.json();

            countries = fetchCountriesJson?.reduce(
                (a: ICurrency[], c: IRestCountry) => {
                    const code = Object.keys(c?.currencies)[0];
                    if (c.cca3 === currencyCountries[code]) {
                        a.push({
                            name: c.currencies[code].name,
                            code: code,
                            symbol: c.currencies[code].symbol,
                            flag: c.flag,
                            rate: currencies[code],
                        });
                    }
                    return a;
                },
                [
                    {
                        // EUR is the base currency, not included in currencies data
                        name: 'European euro',
                        code: 'EUR',
                        symbol: '€',
                        flag: '🇪🇺',
                        rate: 1,
                    },
                ]
            );

            countries.sort((a: ICurrency, b: ICurrency) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        }

        dispatch({ type: 'SET_CURRENCIES', payload: countries });

        if (countries?.length) {
            const countryOptions = countries.map(
                (a: ICurrency): ICurrencyOption => ({
                    value: a.code,
                    label: a.name,
                    symbol: a.symbol,
                    flag: a.flag,
                })
            );
            dispatch({ type: 'SET_CURRENCY_LIST', payload: countryOptions });
        } else {
            const error = 'No country list available';
            dispatch({
                type: 'SET_ERRORS',
                payload: { _error: error },
            });
            throw new Error(error);
        }

        dispatch({ type: 'SET_LOADING', payload: false });
    } catch (e) {
        const _error = (e instanceof Error || e instanceof TypeError) ? e.message : e as string;
        dispatch({
            type: 'SET_ERRORS',
            payload: { _error },
        });
        dispatch({ type: 'SET_LOADING', payload: false });
        throw new Error(_error);
    }
};

export { fetchUserData, fetchCurrencies };
