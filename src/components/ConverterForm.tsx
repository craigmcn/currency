import React, { ChangeEvent, useContext, useEffect } from "react";
import { ValueType } from "react-select";
import Loader from "./Loader";
import { TextField } from "../fields/TextField";
import { SelectField } from "../fields/SelectField";
import ConverterContext from "../hooks/context";
import { ICurrency, ICurrencyOption } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/pro-regular-svg-icons/faExclamationCircle";
import isEqual from "lodash/isEqual";
import "../styles/currencyOptions.scss";

const formatCurrencySelectOption = ({
    value,
    label,
    symbol,
    flag,
}: ICurrencyOption): JSX.Element => (
    <div className="option">
        <img src={flag} width="32" className="option__image" />
        <span className="option__label">{label}</span>
        <span className="option__label option__label--secondary">
            {value} {symbol}
        </span>
    </div>
);

const ConverterForm: React.FC = () => {
    const {
        state: { data, invalid, loading, errors, currencies, currencyList },
        dispatch,
    } = useContext(ConverterContext);
    const { currencyFrom, currencyTo, amountFrom } = data;
    const { amountFrom: invalidAmountFrom, currencyFrom: invalidCurrencyFrom, currencyTo: invalidCurrencyTo } = invalid;

    const currencyFromValue = currencyList?.find(
        c => invalidCurrencyFrom ? c.value === invalidCurrencyFrom?.value : c.value === currencyFrom?.value
    );

    const setErrors = (error: { [key: string]: string }): void => {
        dispatch({
            type: "SET_ERRORS",
            payload: {
                ...errors,
                ...error,
            },
        });
    };

    const restoreInvalid = (type: string): void => {
        let payload: number | ICurrencyOption | undefined;
        switch (type) {
            case "SET_AMOUNT_FROM":
                payload = invalidAmountFrom;
                break;
            case "SET_CURRENCY_FROM":
                payload = invalidCurrencyFrom;
                break;
            case "SET_CURRENCY_TO":
                payload = invalidCurrencyTo;
                break;
            default:
                return;
        }
        if (payload) {
            dispatch({ type, payload });
        }
    }

    useEffect(() => {
        const hasErrors = errors.currencyFrom || errors.currencyTo || errors.amountFrom
        const hasValues = currencyFrom && currencyTo && amountFrom
        if (!hasErrors && hasValues) {
            const rateFrom =
                currencies?.find(
                            (c: ICurrency) => c.code === currencyFrom?.value
                        )?.rate ?? 1;
            const rateTo =
                currencies?.find((c: ICurrency) => c.code === currencyTo?.value)
                            ?.rate ?? 1;

            dispatch({ type: "SET_RATE", payload: rateTo / rateFrom });
            dispatch({
                type: "SET_AMOUNT_TO",
                payload: amountFrom && amountFrom * (rateTo / rateFrom),
            });
        }
    }, [currencies, currencyFrom, currencyTo, amountFrom]);

    const handleCurrencyFromChange = (
        value: ValueType<ICurrencyOption, false>
    ): void => {
        if (
            (!invalidCurrencyTo && isEqual(value, currencyTo)) ||
            (invalidCurrencyTo && isEqual(value, invalidCurrencyTo))
        ) {
            setErrors({ currencyFrom: "Currencies must be different" });
            dispatch({ type: "SET_INVALID_CURRENCY_FROM", payload: value });
        } else {
            setErrors({ currencyFrom: "", currencyTo: "" });
            dispatch({ type: "SET_CURRENCY_FROM", payload: value });

            restoreInvalid("SET_CURRENCY_TO");
            restoreInvalid("SET_AMOUNT_FROM");
        }
    };

    const handleCurrencyToChange = (
        value: ValueType<ICurrencyOption, false>
    ): void => {
        if (
            (!invalidCurrencyFrom && isEqual(value, currencyFrom)) ||
            (invalidCurrencyFrom && isEqual(value, invalidCurrencyFrom))
        ) {
            setErrors({ currencyTo: "Currencies must be different" });
            dispatch({ type: "SET_INVALID_CURRENCY_TO", payload: value });
        } else {
            setErrors({ currencyFrom: "", currencyTo: "" });
            dispatch({ type: "SET_CURRENCY_TO", payload: value });

            restoreInvalid("SET_CURRENCY_FROM");
            restoreInvalid("SET_AMOUNT_FROM");
        }
    };

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const amount = Number(e.currentTarget.value);
        if (isNaN(amount)) {
            setErrors({ amountFrom: "Amount must be a number." });
        } else if (errors.currencyFrom || errors.currencyTo) {
            dispatch({ type: "SET_INVALID_AMOUNT_FROM", payload: amount });
        } else {
            setErrors({ amountFrom: "" });
            dispatch({ type: "SET_AMOUNT_FROM", payload: amount });
        
            restoreInvalid("SET_CURRENCY_FROM");
            restoreInvalid("SET_CURRENCY_TO");
        }
    };

    return (
        <div className="flex__item flex__item--12 flex__item--4-md">
            {loading ? (
                <Loader />
            ) : errors._error ? (
                <div className="alert alert--danger">
                    <div className="alert__icon" aria-hidden="true">
                        <FontAwesomeIcon icon={faExclamationCircle} size="2x" />
                    </div>
                    <div className="alert__text">{errors._error}</div>
                </div>
            ) : (
                <form>
                    <SelectField
                        id="currencyFrom"
                        label="Convert from currency"
                        options={currencyList}
                        handleChange={handleCurrencyFromChange}
                        selectedOption={currencyFromValue}
                        formatOptionLabel={formatCurrencySelectOption}
                        error={errors.currencyFrom}
                    />

                    <SelectField
                        id="currencyTo"
                        label="To currency"
                        options={currencyList}
                        handleChange={handleCurrencyToChange}
                        formatOptionLabel={formatCurrencySelectOption}
                        error={errors.currencyTo}
                    />

                    <TextField
                        id="amountFrom"
                        label="Amount"
                        handleChange={handleAmountChange}
                        error={errors.amountFrom}
                    />
                </form>
            )}
        </div>
    );
};

export default ConverterForm;
