import React, { ChangeEvent, useContext, useEffect } from "react";
import { ValueType } from "react-select";
import Loader from "./Loader";
import { TextField } from "../fields/TextField";
import { SelectField } from "../fields/SelectField";
import ConverterContext from "../hooks/context";
import { ICurrency, ICurrencyOption } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/pro-regular-svg-icons/faExclamationCircle";

const formatCurrencySelectOption = ({ value, label, symbol, flag }: ICurrencyOption): JSX.Element => (
        <div style={{ display: "flex" }}>
            <img src={flag} width="32" style={{ border: "1px solid #eee", marginRight: "4px", maxHeight: "24px", maxWidth: "32px" }} />
            <div style={{ width: "9.25rem" }}>{label}</div>
            <div className="text--muted" style={{ marginLeft: "4px" }}>{value}</div>
            <div className="text--muted" style={{ marginLeft: "4px" }}>{symbol}</div>
        </div>
    );

const ConverterForm: React.FC = () => {
    const {
        state: { data, loading, error, currencies, currencyList, user },
        dispatch,
    } = useContext(ConverterContext);
    const { currencyFrom, currencyTo, amountFrom, rate, valid } = data;

    const currencyFromValue = currencyList?.find(
        c => c.value === currencyFrom?.value
    );

    useEffect(() => {
        if (!currencies || !currencyFrom?.value || !currencyTo?.value) {
            dispatch({
                type: "SET_VALID",
                payload: { valid: false, error: "" },
            });
        } else if (currencies && currencyFrom?.value === currencyTo?.value) {
            dispatch({
                type: "SET_VALID",
                payload: {
                    valid: false,
                    error: "Currencies must be different",
                },
            });
        } else if (amountFrom && isNaN(Number(amountFrom))) {
            dispatch({
                type: "SET_VALID",
                payload: { valid: false, error: "Amount is not a number" },
            });
        } else {
            dispatch({
                type: "SET_VALID",
                payload: { valid: true, error: "" },
            });
        }
    }, [currencies, currencyFrom, currencyTo, amountFrom]);

    useEffect(() => {
        if (valid) {
            const rateFrom =
                currencies?.find(
                    (c: ICurrency) => c.code === currencyFrom?.value
                )?.rate ?? 1;
            const rateTo =
                currencies?.find((c: ICurrency) => c.code === currencyTo?.value)
                    ?.rate ?? 1;
            dispatch({ type: "SET_RATE", payload: rateTo / rateFrom });
        }
    }, [currencies, currencyFrom, currencyTo, valid]);

    useEffect(() => {
        if (valid) {
            const amount = Number(amountFrom);
            dispatch({
                type: "SET_AMOUNT_TO",
                payload: !isNaN(amount) ? amount * rate : 0,
            });
        }
    }, [amountFrom, rate, valid]);

    const handleCurrencyFromChange = (value: ValueType<ICurrencyOption>) => {
        dispatch({ type: "SET_CURRENCY_FROM", payload: value });
    };

    const handleCurrencyToChange = (value: ValueType<ICurrencyOption>) => {
        dispatch({ type: "SET_CURRENCY_TO", payload: value });
    };

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: "SET_AMOUNT_FROM", payload: e.currentTarget.value });
    };

    return (
        <div className="flex__item flex__item--12 flex__item--4-md">
            {loading ? (
                <Loader />
            ) : error ? (
                <div className="alert alert--danger">
                    <div className="alert__icon" aria-hidden="true">
                        <FontAwesomeIcon icon={faExclamationCircle} size="2x" />
                    </div>
                    <div className="alert__text">{error}</div>
                </div>
            ) : (
                <form>
                    <SelectField
                        id="currencyFrom"
                        label="Currency from"
                        options={currencyList}
                        handleChange={handleCurrencyFromChange}
                        selectedOption={currencyFromValue}
                        formatOptionLabel={ formatCurrencySelectOption }
                    />

                    <SelectField
                        id="currencyTo"
                        label="Currency to"
                        options={currencyList}
                        handleChange={handleCurrencyToChange}
                        formatOptionLabel={ formatCurrencySelectOption }
                    />

                    <TextField
                        id="amountFrom"
                        label="Amount"
                        handleChange={handleAmountChange}
                    />
                </form>
            )}
        </div>
    );
};

export default ConverterForm;
