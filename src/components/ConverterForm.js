import React from 'react'
import { connect } from 'react-redux'
import { useAsync } from 'react-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { setConverterData } from '../actions/converter'
import { getConverterData } from '../selectors/converter'

const ipdataco = process.env.REACT_APP_IPDATA_CO;

export class ConverterForm extends React.Component {

  constructor(props) {
    super(props)

    let country, countries, currencies, currencyFrom
    //console.log(country, countries, currencies, currencyFrom)
    fetch(`https://api.ipdata.co?api-key=${ipdataco}`)
      .then(results => results.json())
      .then(data => {
        country = data.country_code
        //console.log(country, countries, currencies, currencyFrom)
        return fetch('https://api.exchangeratesapi.io/latest')
      })
      .then(results => results.json())
      .then(data => {
        currencies = Object.keys(data.rates)
        console.log(country, countries, currencies, currencyFrom)
        return fetch('https://restcountries.eu/rest/v2/all')
      })
      .then(results => results.json())
      .then(data => {
        let pushed = []
        countries = data.reduce((a, c) => {
          if (c.currencies[0].name && c.currencies[0].code && !pushed.includes(c.currencies[0].code) && currencies.includes(c.currencies[0].code)) {
            a.push({ name: c.currencies[0].name, code: c.currencies[0].code, symbol: c.currencies[0].symbol })
            pushed.push(c.currencies[0].code)

            if (country === c.alpha2Code) {
              currencyFrom = c.currencies[0].code
              //console.log(country, countries, currencies, currencyFrom)
            }
          }
          return a
        }, [])
        console.log(country, countries, currencies, currencyFrom)
        countries.sort((a, b) => {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        })
        //console.log(country, countries, currencies, currencyFrom)
      })

  }

  componentDidMount() {

  }

  createSelectItems(array) {
    if (!array) {
      console.warn('No countries to set select items.')
      return ''
    }
    return array.map((a, i) => {
      return (<option key={i} value={a.code}>{a.name} ({a.code})</option>)
    })
  }

  handleChange = e => {
    const key = e.target.name
    const value = e.target.value
    this.props.setConverterData({ [key]: value, amountTo: 0 })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.calculateConversion(e.target.currencyFrom.value, e.target.currencyTo.value, e.target.amountFrom.value)
  }

  calculateConversion = (currencyFrom, currencyTo, amountFrom) => {
    if (isNaN(parseFloat(amountFrom))) {
      this.props.setConverterData({ error: 'Amount is not a number' })
      return false
    }
    let rate = 1
    fetch(`https://api.exchangeratesapi.io/latest?symbols=${currencyFrom},${currencyTo}`)
      .then(results => results.json())
      .then(data => {
        if (data.error) {
          throw new Error(`${data.error}`)
        }
        rate = data.rates[currencyTo] / data.rates[currencyFrom]
        this.props.setConverterData({ error: '', currencyFrom, currencyTo, amountFrom: parseFloat(amountFrom).toFixed(2), amountTo: (amountFrom * rate).toFixed(2), rate })
      })
      .catch(error => {
        console.error(error)
        this.props.setConverterData({ error: error.toString() })
      })

    return true
  }

  render() {

    return (

      <div className="flex__item flex__item--12 flex__item--6-sm flex__item--4-md">
        <form className="form" onSubmit={this.handleSubmit}>

          <div className="form__group">
            <label className="form__label">Currency from</label>
            <select id="currencyFrom" name="currencyFrom" className="form__control" value={this.props.converterData.currencyFrom} onChange={this.handleChange}>
              <option value="">Select</option>
              {this.createSelectItems(this.props.converterData.countries)}
            </select>
          </div>

          <div className="form__group">
            <label className="form__label">Currency to</label>
            <select id="currencyTo" name="currencyTo" className="form__control" value={this.props.converterData.currencyTo} onChange={this.handleChange}>
              <option value="">Select</option>
              {this.createSelectItems(this.props.converterData.countries)}
            </select>
          </div>

          <div className="form__group">
            <label className="form__label">Amount</label>
            <input id="amountFrom" name="amountFrom" className="form__control" type="text" onChange={this.handleChange} />
          </div>

          <div>
            <button className="button button--primary button--large"><FontAwesomeIcon icon={['far', 'sync-alt']} /> Convert</button>
          </div>

        </form>
      </div>
    )

  }
}

const mapStateToProps = state => {
  return {
    converterData: getConverterData(state)
  }
}

const mapDispatchToProps = dispatch => ({
  setConverterData: conversion => dispatch(setConverterData(conversion))
})

export default connect(mapStateToProps, mapDispatchToProps)(ConverterForm)
