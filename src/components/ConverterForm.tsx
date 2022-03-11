import React, { ChangeEvent, KeyboardEvent, useCallback, useContext, useEffect } from 'react';
import { SingleValue } from 'react-select';
import { FormatOptionLabelMeta } from 'react-select/dist/declarations/src/Select';
import Loader from './Loader';
import { TextField } from '../fields/TextField';
import { SelectField } from '../fields/SelectField';
import ConverterContext from '../hooks/context';
import { ICurrency, ICurrencyOption } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/pro-regular-svg-icons/faExclamationCircle';
import isEqual from 'lodash/isEqual';
import { isBrowser } from 'react-device-detect';
import '../styles/currencyOptions.scss';

const formatCurrencySelectOption = ({
    value,
    label,
    symbol,
    flag,
}: ICurrencyOption,
{
    context,
    selectValue,
}: FormatOptionLabelMeta<ICurrencyOption>): JSX.Element => {
    const hl = context === 'menu' && selectValue?.[0]?.value === value ? ' option__label--secondary-hl' : '';

    return (
        <div className="option">
            <span className="option__image">{ flag }</span>
            <span className="option__label">{ label }</span>
            <span className={ `option__label option__label--secondary${hl}` }>
                { value } { symbol }
            </span>
        </div>
    );
};

const ConverterForm = (): JSX.Element => {
    const {
        state: { data, invalid, loading, errors, currencies, currencyList },
        dispatch,
    } = useContext(ConverterContext);
    const { currencyFrom, currencyTo, amountFrom } = data;
    const { amountFrom: invalidAmountFrom, currencyFrom: invalidCurrencyFrom, currencyTo: invalidCurrencyTo } = invalid;

    const currencyFromValue = currencyList?.find(
        c => invalidCurrencyFrom ? c.value === invalidCurrencyFrom?.value : c.value === currencyFrom?.value
    );

    const setErrors = useCallback((error: { [key: string]: string }): void => {
        dispatch({
            type: 'SET_ERRORS',
            payload: {
                ...errors,
                ...error,
            },
        });
    }, [
        dispatch,
        errors,
    ]);

    const restoreInvalid = useCallback((type: string): void => {
        let payload: number | ICurrencyOption | undefined;
        switch (type) {
                case 'SET_AMOUNT_FROM':
                    payload = invalidAmountFrom;
                    break;
                case 'SET_CURRENCY_FROM':
                    payload = invalidCurrencyFrom;
                    break;
                case 'SET_CURRENCY_TO':
                    payload = invalidCurrencyTo;
                    break;
                default:
                    return;
        }
        if (payload) {
            dispatch({ type, payload });
        }
    }, [
        invalidAmountFrom,
        invalidCurrencyFrom,
        invalidCurrencyTo,
        dispatch,
    ]);

    useEffect(() => {
        const hasErrors = errors.currencyFrom || errors.currencyTo || errors.amountFrom;
        const hasValues = currencyFrom && currencyTo && amountFrom;
        if (!hasErrors && hasValues) {
            const rateFrom =
                currencies?.find(
                    (c: ICurrency) => c.code === currencyFrom?.value
                )?.rate ?? 1;
            const rateTo =
                currencies?.find((c: ICurrency) => c.code === currencyTo?.value)
                    ?.rate ?? 1;

            dispatch({ type: 'SET_RATE', payload: rateTo / rateFrom });
            dispatch({
                type: 'SET_AMOUNT_TO',
                payload: amountFrom && amountFrom * (rateTo / rateFrom),
            });
        }
    }, [currencies, currencyFrom, currencyTo, amountFrom, errors, dispatch]);

    const handleCurrencyFromChange = useCallback((
        value: SingleValue<ICurrencyOption>
    ): void => {
        if (
            (!invalidCurrencyTo && isEqual(value, currencyTo)) ||
            (invalidCurrencyTo && isEqual(value, invalidCurrencyTo))
        ) {
            setErrors({ currencyFrom: 'Currencies must be different' });
            dispatch({ type: 'SET_INVALID_CURRENCY_FROM', payload: value });
        } else {
            setErrors({ currencyFrom: '', currencyTo: '' });
            dispatch({ type: 'SET_CURRENCY_FROM', payload: value });

            restoreInvalid('SET_CURRENCY_TO');
            restoreInvalid('SET_AMOUNT_FROM');
        }
    }, [
        invalidCurrencyTo,
        currencyTo,
        setErrors,
        dispatch,
        restoreInvalid,
    ]);

    const handleCurrencyToChange = useCallback((
        value: SingleValue<ICurrencyOption>
    ): void => {
        if (
            (!invalidCurrencyFrom && isEqual(value, currencyFrom)) ||
            (invalidCurrencyFrom && isEqual(value, invalidCurrencyFrom))
        ) {
            setErrors({ currencyTo: 'Currencies must be different' });
            dispatch({ type: 'SET_INVALID_CURRENCY_TO', payload: value });
        } else {
            setErrors({ currencyFrom: '', currencyTo: '' });
            dispatch({ type: 'SET_CURRENCY_TO', payload: value });

            restoreInvalid('SET_CURRENCY_FROM');
            restoreInvalid('SET_AMOUNT_FROM');
        }
    }, [
        invalidCurrencyFrom,
        currencyFrom,
        setErrors,
        dispatch,
        restoreInvalid,
    ]);

    const handleAmountChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        const amount = Number(e.currentTarget.value);
        if (isNaN(amount) || amount === 0) {
            setErrors({ amountFrom: 'Amount must be a number.' });
        } else if (errors.currencyFrom || errors.currencyTo) {
            dispatch({ type: 'SET_INVALID_AMOUNT_FROM', payload: amount });
        } else {
            setErrors({ amountFrom: '' });
            dispatch({ type: 'SET_AMOUNT_FROM', payload: amount });

            restoreInvalid('SET_CURRENCY_FROM');
            restoreInvalid('SET_CURRENCY_TO');
        }
    }, [
        errors,
        setErrors,
        dispatch,
        restoreInvalid,
    ]);

    const handleAmountEnter = useCallback((e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
        }
    }, []);

    return (
        <div className="flex__item flex__item--12 flex__item--4-md">
            {loading ? (
                <Loader />
            ) : errors._error ? (
                <div className="alert alert--danger">
                    <div className="alert__icon" aria-hidden="true">
                        <FontAwesomeIcon icon={ faExclamationCircle } size="2x" />
                    </div>
                    <div className="alert__text">{errors._error}</div>
                </div>
            ) : (
                <form>
                    <SelectField
                        id="currencyFrom"
                        label="Convert from currency"
                        options={ currencyList }
                        handleChange={ handleCurrencyFromChange }
                        selectedOption={ currencyFromValue }
                        formatOptionLabel={ formatCurrencySelectOption }
                        error={ errors.currencyFrom }
                        searchable={ isBrowser }
                    />

                    <SelectField
                        id="currencyTo"
                        label="To currency"
                        options={ currencyList }
                        handleChange={ handleCurrencyToChange }
                        formatOptionLabel={ formatCurrencySelectOption }
                        error={ errors.currencyTo }
                        searchable={ isBrowser }
                    />

                    <TextField
                        id="amountFrom"
                        label="Amount"
                        inputMode="numeric"
                        handleChange={ handleAmountChange }
                        handleKeyPress={ handleAmountEnter }
                        error={ errors.amountFrom }
                    />
                </form>
            )}
        </div>
    );
};

export default ConverterForm;
