import React, { Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const getResult = ({ currencyFrom = '', currencyTo = '', amountFrom = 0, amountTo = 0, rate = 0, error = '' }) => {
  if (error) {
    return <p className="text--danger"><FontAwesomeIcon icon={['far', 'exclamation-triangle']} /> {error}</p>
  } else if (amountTo !== 0) {
    return (<Fragment>
      <p><strong>{currencyFrom}&#160;{amountFrom}</strong> equals</p>
      <p className="text--primary text--large"><strong>{currencyTo}&#160;{amountTo}</strong></p>
      <p className="text--muted">Exchange rate: {currencyFrom}&#160;1 = {currencyTo}&#160;{rate.toPrecision(5)}</p>
    </Fragment>)
  } else {
    return <p><FontAwesomeIcon icon={['far', 'play-circle']} /> Please enter values</p>
  }
}
