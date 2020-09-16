import React, { Fragment } from 'react'
import Error from './Error'
import Card from './Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle } from '@fortawesome/pro-regular-svg-icons/faPlayCircle'
import { IConversionData } from '../types'

interface IProps {
  data: IConversionData
}

const ConverterResult: React.FC<IProps> = (props) => {

  const { data: { currencyFrom, currencyTo, amountFrom, amountTo, rate, error } } = props

  return (
    <Card title="Conversion" type="primary">
      { error

        ?

          <Error error={ error } />

        :

          amountTo

          ?
            <Fragment>
              <p>
                <strong>{ currencyFrom?.value } { amountFrom }</strong> equals
              </p>
              <p className="text--primary text--large">
                <strong>{ currencyTo?.value } { Number(amountTo).toFixed(3) }</strong>
              </p>
              <p className="text--muted">Exchange rate: { currencyFrom?.value } 1 = { currencyTo?.value } { rate.toPrecision(4) }</p>
            </Fragment>

          :

            <p><FontAwesomeIcon icon={ faPlayCircle } /> Please enter values</p>

      }
      
    </Card>
  )
}

export default ConverterResult
