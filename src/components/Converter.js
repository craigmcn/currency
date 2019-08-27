import React, { Fragment } from 'react';

const ipdataco = process.env.REACT_APP_IPDATA_CO;

class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currencyFrom: '',
      currencyTo: '',
      amountFrom: '',
      amountTo: 0,
      country: '',
      countries: []
    };
  }

  componentDidMount() {
    fetch(`https://api.ipdata.co?api-key=${ipdataco}`)
      .then(results => results.json())
      .then(data => {
        this.setState(() => ({ country: data.country_code }))
        return fetch('https://restcountries.eu/rest/v2/all')
      })
      .then(results => results.json())
      .then(data => {
        let pushed = []
        const countries = data.reduce((a, c) => {
          if (c.currencies[0].name && c.currencies[0].code && !pushed.includes(c.currencies[0].code)) {
            a.push({ name: c.currencies[0].name, code: c.currencies[0].code, symbol: c.currencies[0].symbol })
            pushed.push(c.currencies[0].code)

            if (this.state.country === c.alpha2Code) {
              this.setState(() => ({ currencyFrom: c.currencies[0].code }))
            }
          }
          return a
        }, [])
        countries.sort((a, b) => {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        })
        this.setState(() => ({ countries }))
      })
  }

  createSelectItems(array) {
    return array.map((a, i) => {
      return (<option key={i} value={a.code}>{a.name} ({a.code})</option>)
    })
  }

  handleChange = e => {
    const key = e.target.name
    const value = e.target.value
    this.setState(() => ({ [key]: value, amountTo: 0 }))
  }

  handleSubmit = e => {
    e.preventDefault()
    this.calculateConversion(e.target.currencyFrom.value, e.target.currencyTo.value, e.target.amountFrom.value)
  }

  calculateConversion = (currencyFrom, currencyTo, amountFrom) => {
    let rate = 1
    fetch(`https://api.exchangeratesapi.io/latest?symbols=${currencyFrom},${currencyTo}`)
      .then(results => results.json())
      .then(data => {
        if (!data.success) throw new Error(`${data.error.code} ${data.error.type}`)
        rate = data.rates[currencyTo] / data.rates[currencyFrom]
        this.setState(() => ({ currencyFrom, currencyTo, amountFrom: parseFloat(amountFrom).toFixed(2), amountTo: (amountFrom * rate).toFixed(2) }))
      })
      .catch(error => {
        console.error(error)
      })

    return true
  }

  render() {

    let result
    if (this.state.amountTo !== 0) {
      result = <Fragment>
        <p><strong>{this.state.currencyFrom}&#160;{this.state.amountFrom}</strong> equals</p>
        <p className="text--primary text--large"><strong>{this.state.currencyTo}&#160;{this.state.amountTo}</strong></p>
      </Fragment>
    } else {
      result = <p>Please enter values</p>
    }

    return (
      <div className="flex flex--container">

        <div className="flex__contained">
          <form className="form" onSubmit={this.handleSubmit}>

            <div className="form__group">
              <label className="form__label">Currency from</label>
              <select id="currencyFrom" name="currencyFrom" className="form__control" value={this.state.currencyFrom} onChange={this.handleChange}>
                <option value="">Select</option>
                {this.createSelectItems(this.state.countries)}
              </select>
            </div>

            <div className="form__group">
              <label className="form__label">Currency to</label>
              <select id="currencyTo" name="currencyTo" className="form__control" value={this.state.currencyTo} onChange={this.handleChange}>
                <option value="">Select</option>
                {this.createSelectItems(this.state.countries)}
              </select>
            </div>

            <div className="form__group">
              <label className="form__label">Amount</label>
              <input id="amountFrom" name="amountFrom" className="form__control" type="text" value={this.state.amountFrom} onChange={this.handleChange} />
            </div>

            <div>
              <button className="button button--primary button--large">Convert</button>
            </div>

          </form>
        </div>

        <div className="card card--primary flex__contained flex--grow">
          <div className="card__title">
            <h3>Conversion</h3>
          </div>
          <div className="card__body">
            {result}
          </div>
        </div>

      </div>
    )
  }
}

export default Converter