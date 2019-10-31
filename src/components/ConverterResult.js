import React from 'react';
import { connect } from 'react-redux'
import { getResult } from '../selectors/converter'

export const ConverterResult = props => (
  <div className="card card--primary flex__item">
    <div className="card__title">
      <h3>Conversion</h3>
    </div>
    <div className="card__body">
      {props.result}
    </div>
  </div>
)

const mapStateToProps = state => {
  return {
    result: getResult(state)
  }
}

export default connect(mapStateToProps)(ConverterResult)
