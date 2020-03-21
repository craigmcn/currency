import React, { Dispatch, ChangeEvent } from 'react'
import { ValueType } from 'react-select'
import Loader from './Loader'
import { TextField } from '../fields/TextField'
import { SelectField, ISelectOption } from '../fields/SelectField'
import { IConversionData } from '../types'

interface IProps {
  loading: boolean
  currencyList?: ISelectOption[]
  data: Partial<IConversionData>
  changeFrom: Dispatch<any>
  changeTo: Dispatch<any>
  changeAmount: Dispatch<any>
}

const ConverterForm: React.FC<IProps> = (props) => {

  const { loading, data, currencyList, changeFrom, changeTo, changeAmount } = props

  const currencyFromValue = currencyList?.find(c => c.value === data?.currencyFrom?.value)

  const handleCurrencyFromChange = (value: ValueType<ISelectOption>) => {
    changeFrom(value)
  }

  const handleCurrencyToChange = (value: ValueType<ISelectOption>) => {
    changeTo(value)
  }

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    changeAmount(e.currentTarget.value)
  }

  return <div className="flex__item flex__item--12 flex__item--4-md">
    { loading

    ?

      <Loader />

    :

      <form>
        
        <SelectField id="currencyFrom" label="Currency from" options={ currencyList } handleChange={ handleCurrencyFromChange } selectedOption={ currencyFromValue } />
        
        <SelectField id="currencyTo" label="Currency to" options={ currencyList } handleChange={ handleCurrencyToChange } />

        <TextField id="amountFrom" label="Amount" handleChange={ handleAmountChange } />

      </form>
    }
  </div>

}

export default ConverterForm
