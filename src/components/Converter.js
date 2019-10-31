import React from 'react';
import ConverterForm from './ConverterForm'
import ConverterResult from './ConverterResult'

const Converter = () => (
  <div className="flex flex--grid">
    <ConverterForm />
    <ConverterResult />
  </div>
)

export default Converter
