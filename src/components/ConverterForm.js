import React from 'react'
import { connect } from 'react-redux'
import Async from 'react-async'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { setConverterData } from '../actions/converter'

const ipdataco = process.env.REACT_APP_IPDATA_CO;

export class ConverterForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = { countryOptions: '', currencyFrom: '', currencyTo: '' } 
  }

  loadCountries = async () => {
    let countries = [], countryOptions
    try {
      const country = await fetch(`https://api.ipdata.co?api-key=${ipdataco}`)
        .then(res => res.json())
        .then(data => {
          if (data.message) console.error(data.message)
          return data.country_code
        })

      const currencies = await fetch(`https://api.exchangeratesapi.io/latest`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            throw new Error(`${data.error}`)
          }
          return Object.keys(data.rates)
        })

      if (currencies) {
        countries = await fetch('https://restcountries.eu/rest/v2/all')
          .then(res => res.json())
          .then(data => {
            let pushed = []
            let countryList = data.reduce((a, c) => {
              if (c.currencies[0].name && c.currencies[0].code && !pushed.includes(c.currencies[0].code) && currencies.includes(c.currencies[0].code)) {
                a.push({ name: c.currencies[0].name, code: c.currencies[0].code, symbol: c.currencies[0].symbol })
                pushed.push(c.currencies[0].code)

                if (country === c.alpha2Code) {
                  this.setState(state => ({ ...state, currencyFrom: c.currencies[0].code }))
                }
              }
              return a
            }, [])
            countryList.sort((a, b) => {
              if (a.name < b.name) { return -1; }
              if (a.name > b.name) { return 1; }
              return 0;
            })
            return countryList
          })
      }
      
      if (countries.length) {
        countryOptions = countries.map((a, i) => {
          return (<option key={i} value={a.code}>{a.name} ({a.code})</option>)
        })
        this.setState(state => ({ ...state, countryOptions: countryOptions }))
      } else {
        throw new Error('No country list available')
      }

    } catch(err) {
      throw new Error(err.toString())
    }
  }

  handleChange = e => {
    const key = e.target.name
    const value = e.target.value
    this.setState(state => ({ ...state, [key]: value }))
    this.props.setConverterData({ [key]: value, amountTo: 0 })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.calculateConversion(e.target.currencyFrom.value, e.target.currencyTo.value, e.target.amountFrom.value)
    e.target.submit.blur()
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
        this.props.setConverterData({ error: null, currencyFrom, currencyTo, amountFrom: parseFloat(amountFrom).toFixed(2), amountTo: (amountFrom * rate).toFixed(2), rate })
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

        <Async promiseFn={this.loadCountries}>
          <Async.Loading>
            <div className="alert alert--info">
              <div className="alert__text"><FontAwesomeIcon icon={['far', 'sync-alt']} spin /> Loading &hellip;</div>
            </div>
          </Async.Loading>
          <Async.Fulfilled>
            <form className="form" onSubmit={this.handleSubmit}>

              <div className="form__group">
                <label className="form__label">Currency from</label>
                <select id="currencyFrom" name="currencyFrom" className="form__control" value={this.state.currencyFrom} onChange={this.handleChange}>
                  <option value="">Select</option>
                  {this.state.countryOptions}
                </select>
              </div>

              <div className="form__group">
                <label className="form__label">Currency to</label>
                <select id="currencyTo" name="currencyTo" className="form__control" value={this.state.currencyTo} onChange={this.handleChange}>
                  <option value="">Select</option>
                  {this.state.countryOptions}
                </select>
              </div>

              <div className="form__group">
                <label className="form__label">Amount</label>
                <input id="amountFrom" name="amountFrom" className="form__control" type="text" onChange={this.handleChange} />
              </div>

              <div>
                <button id="submit" name="submit" className="button button--primary button--large" type="submit"><FontAwesomeIcon icon={['far', 'sync-alt']} /> Convert</button>
              </div>

            </form>
          </Async.Fulfilled>
          <Async.Rejected>
            {error => (
                <div className="alert alert--danger">
                  <div className="alert__icon"><FontAwesomeIcon icon={['far', 'exclamation-triangle']} size="2x" /></div>
                  <div className="alert__text">{ error.message }</div>
                </div>
              )
            }
          </Async.Rejected>
        </Async>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  setConverterData: conversion => dispatch(setConverterData(conversion))
})

export default connect(undefined, mapDispatchToProps)(ConverterForm)
