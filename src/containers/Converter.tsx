import React, { useEffect, useReducer } from "react";
import ConverterContext from "../hooks/context";
import converterReducer, { defaultState } from "../hooks/reducers";
import { fetchUserData, fetchCurrencies } from "../utils";
import { ICurrency } from "../types";
import ConverterForm from "../components/ConverterForm";
import ConverterResult from "../components/ConverterResult";

const Converter: React.FC = () => {
    const [state, dispatch] = useReducer(converterReducer, defaultState);
    const { currencies, user } = state;

    useEffect(() => {
        fetchUserData(dispatch);
        fetchCurrencies(dispatch);
    }, []);

    useEffect(() => {
        if (!user?.message && currencies) {
            const userCurrency = currencies.find(
                (c: ICurrency) => c.code === user?.currency?.code
            );
            const { code, name, symbol, flag } = userCurrency ?? {};
            const value = code ?? "";
            const label = name ?? "";
            dispatch({
                type: "SET_CURRENCY_FROM",
                payload: { value, label, symbol, flag },
            });
        }
    }, [user, currencies]);

    return (
        <ConverterContext.Provider value={ { state, dispatch } }>
            <div className="flex flex--grid">
                <ConverterForm />
                <ConverterResult />
            </div>
        </ConverterContext.Provider>
    );
};

export default Converter;
