import { LookupResponse } from 'ipdata'
import { ISelectOption } from './fields/SelectField'

export interface IConverterAction {
    type: string;
    payload: any;
}

export interface IConversionState {
    loading: boolean;
    timestamp?: number;
    errors: IConversionErrors;
    data: IConversionData;
    invalid: IConversionBase;
    currencies: ICurrency[];
    currencyList: ISelectOption[];
    user?: IUser;
}

interface IConversionBase {
    amountFrom?: number;
    currencyFrom?: ICurrencyOption;
    currencyTo?: ICurrencyOption;
}

interface IConversionData extends IConversionBase {
    amountTo?: number;
    rate: number;
}

interface IConversionErrors {
    _error: string;
    amountFrom: string;
    currencyFrom: string;
    currencyTo: string;
}

export interface ICurrency {
    name: string;
    code: string;
    symbol?: string;
    flag?: string;
    rate?: number;
}

export interface ICurrencies {
    [code: string]: {
        name: string;
        symbol: string;
    }
}

export interface ICurrencyOption extends ISelectOption {
    symbol?: string;
    flag?: string;
}

export interface IRestCountry {
    cca3: string;
    currencies: ICurrencies;
    flag?: string;
}

export interface IIpData extends LookupResponse {
    message?: string;
}

interface IUser {
    message?: string;
    currency?: {
        name: string;
        code: string;
    };
}
