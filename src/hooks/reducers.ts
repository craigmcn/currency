import { IConversionState, IConverterAction } from '../types';

export const defaultState: IConversionState = {
    loading: true,
    timestamp: undefined,
    errors: {
        _error: '',
        amountFrom: '',
        currencyFrom: '',
        currencyTo: '',
    },
    data: {
        amountFrom: undefined,
        amountTo: undefined,
        currencyFrom: undefined,
        currencyTo: undefined,
        rate: 1,
    },
    invalid: {
        amountFrom: undefined,
        currencyFrom: undefined,
        currencyTo: undefined,
    },
    currencies: [],
    currencyList: [],
    user: undefined,
};

const converterReducer = (
    state: IConversionState,
    action: IConverterAction
): IConversionState => {
    switch (action.type) {
            case 'SET_USER':
                return {
                    ...state,
                    user: action.payload,
                };

            case 'SET_TIMESTAMP':
                return {
                    ...state,
                    timestamp: action.payload,
                };

            case 'SET_CURRENCIES':
                return {
                    ...state,
                    currencies: action.payload,
                };

            case 'SET_CURRENCY_LIST':
                return {
                    ...state,
                    currencyList: action.payload,
                };

            case 'SET_CURRENCY_FROM':
                return {
                    ...state,
                    data: {
                        ...state.data,
                        currencyFrom: action.payload,
                    },
                    invalid: {
                        ...state.invalid,
                        currencyFrom: undefined,
                    },
                };

            case 'SET_INVALID_CURRENCY_FROM':
                return {
                    ...state,
                    invalid: {
                        ...state.invalid,
                        currencyFrom: action.payload,
                    },
                };

            case 'SET_CURRENCY_TO':
                return {
                    ...state,
                    data: {
                        ...state.data,
                        currencyTo: action.payload,
                    },
                    invalid: {
                        ...state.invalid,
                        currencyTo: undefined,
                    },
                };

            case 'SET_INVALID_CURRENCY_TO':
                return {
                    ...state,
                    invalid: {
                        ...state.invalid,
                        currencyTo: action.payload,
                    },
                };

            case 'SWITCH_CURRENCIES':
                return {
                    ...state,
                    data: {
                        ...state.data,
                        currencyFrom: state.data.currencyTo,
                        currencyTo: state.data.currencyFrom,
                    },
                };

            case 'SET_AMOUNT_FROM':
                return {
                    ...state,
                    data: {
                        ...state.data,
                        amountFrom: action.payload,
                    },
                    invalid: {
                        ...state.invalid,
                        amountFrom: undefined,
                    },
                };

            case 'SET_INVALID_AMOUNT_FROM':
                return {
                    ...state,
                    invalid: {
                        ...state.invalid,
                        amountFrom: action.payload,
                    },
                };

            case 'SET_AMOUNT_TO':
                return {
                    ...state,
                    data: {
                        ...state.data,
                        amountTo: action.payload,
                    },
                };

            case 'SET_RATE':
                return {
                    ...state,
                    data: {
                        ...state.data,
                        rate: action.payload,
                    },
                };

            case 'SET_LOADING':
                return {
                    ...state,
                    loading: action.payload,
                };

            case 'SET_ERRORS':
                return {
                    ...state,
                    errors: action.payload,
                };

            default:
                return state;
    }
};

export { converterReducer as default };
