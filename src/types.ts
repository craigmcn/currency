import { LookupResponse } from "ipdata";
import { ISelectOption } from "./fields/SelectField";

export interface IConverterAction {
    type: string;
    payload: any;
}

export interface IConversionState {
    loading: boolean;
    error: string;
    data: {
        amountFrom?: number;
        amountTo?: number;
        currencyFrom?: ICurrencyOption;
        currencyTo?: ICurrencyOption;
        valid: boolean;
        error: string;
        rate: number;
    };
    currencies: ICurrency[];
    currencyList: ISelectOption[];
    user?: {
        message?: string;
        currency?: {
            name: string;
            code: string;
        };
    };
}

export interface ICurrency {
    name: string;
    code: string;
    symbol?: string;
    flag?: string;
    rate?: number;
}

export interface ICurrencyOption extends ISelectOption {
    symbol?: string;
    flag?: string;
}

export interface IRestCountry {
    alpha3Code: string;
    currencies: ICurrency[];
    flag?: string;
}

export interface IIpData extends LookupResponse {
    message?: string;
}
