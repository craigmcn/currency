import { IConversionState, IConverterAction } from "../types";

export const defaultState: IConversionState = {
    loading: true,
    error: "",
    data: {
        amountFrom: undefined,
        amountTo: undefined,
        currencyFrom: undefined,
        currencyTo: undefined,
        valid: false,
        error: "",
        rate: 1,
    },
    currencies: [],
    currencyList: [],
    user: undefined,
};

const converterReducer = (
    state: IConversionState,
    action: IConverterAction
) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.payload,
            };

        case "SET_CURRENCIES":
            return {
                ...state,
                currencies: action.payload,
            };

        case "SET_CURRENCY_LIST":
            return {
                ...state,
                currencyList: action.payload,
            };

        case "SET_CURRENCY_FROM":
            return {
                ...state,
                data: {
                    ...state.data,
                    currencyFrom: action.payload,
                },
            };

        case "SET_CURRENCY_TO":
            return {
                ...state,
                data: {
                    ...state.data,
                    currencyTo: action.payload,
                },
            };

        case "SET_AMOUNT_FROM":
            return {
                ...state,
                data: {
                    ...state.data,
                    amountFrom: action.payload,
                },
            };

        case "SET_AMOUNT_TO":
            return {
                ...state,
                data: {
                    ...state.data,
                    amountTo: action.payload,
                },
            };

        case "SET_RATE":
            return {
                ...state,
                data: {
                    ...state.data,
                    rate: action.payload,
                },
            };

        case "SET_VALID":
            return {
                ...state,
                data: {
                    ...state.data,
                    ...action.payload,
                },
            };

        case "SET_LOADING":
            return {
                ...state,
                loading: action.payload,
            };

        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
            };

        default:
            return state;
    }
};

export { converterReducer as default };
