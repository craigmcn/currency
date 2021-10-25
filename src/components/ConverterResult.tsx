import React, { Fragment, useContext } from 'react'
import ConverterContext from '../hooks/context'
import Error from './Error'
import Card from './Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle } from '@fortawesome/pro-regular-svg-icons/faPlayCircle'

const ConverterResult = (): JSX.Element => {
    const {
        errors,
        timestamp,
        data: {
            currencyFrom,
            currencyTo,
            amountFrom,
            amountTo,
            rate,
        },
    } = useContext(ConverterContext).state

    const asOf = timestamp ? new Date(timestamp * 1000) : 0

    return (
        <Card title="Conversion" type="primary">
            { errors._error ? (
                <Error>{ errors._error }</Error>
            ) : amountTo ? (
                <Fragment>
                    <p>
                        <strong>
                            { currencyFrom?.symbol }{' '}
                            { amountFrom }{' '}
                            { currencyFrom?.value }
                        </strong>{' '}
                        equals
                        <span className="text--primary text--large m-t-md m-b-xl" style={ { display: 'block' } }>
                            <strong>
                                { currencyTo?.symbol }{' '}
                                { Number(amountTo).toFixed(3) }{' '}
                                { currencyTo?.value }
                            </strong>
                        </span>
                    </p>
                    <p className="text--muted">
                        Exchange rate: { currencyFrom?.value } 1 ={' '}
                        { currencyTo?.value } { rate.toPrecision(4) }<br />
                        <small>{ asOf && `As of ${asOf.toUTCString()}` }</small>
                    </p>
                </Fragment>
            ) : (
                <p>
                    <FontAwesomeIcon icon={ faPlayCircle } /> Please enter values
                </p>
            ) }
        </Card>
    )
}

export default ConverterResult
