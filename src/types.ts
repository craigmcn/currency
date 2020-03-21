import { LookupResponse } from 'ipdata'
import { ISelectOption } from "./fields/SelectField"

export interface ICurrency {
  name: string
  code: string
  symbol?: string
  rate?: number
}

export interface IRestCountry {
  currencies: ICurrency[]
}

export interface IConversionData {
  amountFrom?: number
  amountTo?: number
  currencyFrom?: ISelectOption
  currencyTo?: ISelectOption
  error: string
  rate: number
}

export interface IIpData extends LookupResponse {
  message?: string
}