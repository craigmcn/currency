import React, { useState, useEffect } from 'react'
import IPData from 'ipdata'
import ConverterForm from '../components/ConverterForm'
import ConverterResult from '../components/ConverterResult'
import { ICurrency, IRestCountry, IIpData } from '../types'
import { ISelectOption } from '../fields/SelectField'

const ipdataco = process.env.REACT_APP_IPDATA_CO ?? ""

const Converter: React.FC = () => {

  const ipdata = new IPData(ipdataco);
  const [loading, setLoading] = useState(true)
  const [userdata, setUserdata] = useState<any>()
  const [currencies, setCurrencies] = useState<ICurrency[]>([])
  const [currencyList, setCurrencyList] = useState<ISelectOption[]>([])
  const [currencyFrom, setCurrencyFrom] = useState<ISelectOption>()
  const [currencyTo, setCurrencyTo] = useState<ISelectOption>()
  const [rate, setRate] = useState(1)
  const [error, setError] = useState('')
  const [valid, setValid] = useState(false)
  const [amountFrom, setAmountFrom] = useState()
  const [amountTo, setAmountTo] = useState(0)

  useEffect(() => {
    const fetchUserData = () => {
      ipdata.lookup()
      .then((data: IIpData) => {
        if (data.message) console.error(data.message)
        setUserdata(data)
      })
    }
    
    const loadCurrencies = async () => {
      let countries: ICurrency[] = []
      try {
        const currencies = await fetch(`https://api.exchangeratesapi.io/latest`)
          .then(res => res.json())
          .then(data => {
            if (data.error) {
              throw new Error(`${data.error}`)
            }
            return data.rates
          })
  
        if (currencies) {
          countries = await fetch('https://restcountries.eu/rest/v2/all?fields=currencies')
            .then(res => res.json())
            .then((data: IRestCountry[]) => {
              let pushed: string[] = []
              let countryList = data.reduce((a: ICurrency[], c: IRestCountry) => {
                if (c.currencies[0].name && c.currencies[0].code && !pushed.includes(c.currencies[0].code) && currencies[c.currencies[0].code]) {
                  a.push({ name: c.currencies[0].name, code: c.currencies[0].code, rate: currencies[c.currencies[0].code] })
                  pushed.push(c.currencies[0].code)
                }
                return a
              }, [{ name: 'European euro', code: 'EUR', rate: 1 }]) // EUR is the base currency, not included in currencies data
              countryList.sort((a: ICurrency, b: ICurrency) => {
                if (a.name < b.name) { return -1; }
                if (a.name > b.name) { return 1; }
                return 0;
              })
              return countryList
            })
        }
        setCurrencies(countries)
  
        if (countries?.length) {
          const countryOptions = countries.map((a: ICurrency): ISelectOption => ({ value: a.code, label: `${a.name} (${a.code})` }))
          setCurrencyList(countryOptions)
        } else {
          throw new Error('No country list available')
        }
        setLoading(false)
  
      } catch (err) {
        throw new Error(err.toString())
      }
    }

    fetchUserData()
    loadCurrencies()
  }, [])

  useEffect(() => {
    if (!userdata?.message) {
      setCurrencyFrom({ value: userdata?.currency?.code, label: `${userdata?.currency?.name} (${userdata?.currency?.code})` })
    }
  }, [userdata])

  useEffect(() => {
    if (!currencies || !currencyFrom?.value || !currencyTo?.value) {
      setError('')
      setValid(false)
    } else if (currencies && currencyFrom?.value === currencyTo?.value) {
      setError('Currencies must be different')
      setValid(false)
    } else if (amountFrom && isNaN(Number(amountFrom))) {
      setError('Amount is not a number')
      setValid(false)
    } else {
      setError('')
      setValid(true)
    }
  }, [currencies, currencyFrom, currencyTo, amountFrom])

  useEffect(() => {
    if (valid) {
      const rateFrom = currencies?.find((c: ICurrency) => c.code === currencyFrom?.value)?.rate ?? 1
      const rateTo = currencies?.find((c: ICurrency) => c.code === currencyTo?.value)?.rate ?? 1
      setRate(rateTo / rateFrom)
    }
  }, [currencyFrom, currencyTo, valid])

  useEffect(() => {
    if (valid) {
      const amount = Number(amountFrom)
      setAmountTo(!isNaN(amount) ? amount * rate : 0)
    }
  }, [amountFrom, rate, valid])

  return (
    <div className="flex flex--grid">
        <ConverterForm loading={ loading } data={ { currencyFrom, currencyTo, amountFrom } } currencyList={ currencyList } changeFrom={ setCurrencyFrom } changeTo={ setCurrencyTo } changeAmount={ setAmountFrom } />
        <ConverterResult data={ { currencyFrom, currencyTo, rate, amountFrom, amountTo, error } } />
    </div>
  )

}

export default Converter
