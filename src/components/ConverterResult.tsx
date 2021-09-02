import React, { Fragment, useContext } from "react";
import ConverterContext from "../hooks/context";
import Error from "./Error";
import Card from "./Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/pro-regular-svg-icons/faPlayCircle";

const ConverterResult: React.FC = () => {
    const {
        errors,
        data: {
            currencyFrom,
            currencyTo,
            amountFrom,
            amountTo,
            rate,
        },
    } = useContext(ConverterContext).state;

    return (
        <Card title="Conversion" type="primary">
            { errors._error ? (
                <Error error={ errors._error } />
            ) : amountTo ? (
                <Fragment>
                    <p>
                        <strong>
                            {currencyFrom?.symbol}{" "}
                            {amountFrom}{" "}
                            {currencyFrom?.value}
                        </strong>{" "}
                        equals
                    </p>
                    <p className="text--primary text--large">
                        <strong>
                            {currencyTo?.symbol}{" "}
                            {Number(amountTo).toFixed(3)}{" "}
                            {currencyTo?.value}
                        </strong>
                    </p>
                    <p className="text--muted">
                        Exchange rate: {currencyFrom?.value} 1 ={" "}
                        {currencyTo?.value} {rate.toPrecision(4)}
                    </p>
                </Fragment>
            ) : (
                <p>
                    <FontAwesomeIcon icon={ faPlayCircle } /> Please enter values
                </p>
            ) }
        </Card>
    );
};

export default ConverterResult;
