const convertCurrencyApp = (state = {}, { type, payload }) => {
  switch (type) {
    case 'SET_CONVERTER_DATA':
      return {
        ...state,
        ...payload
      }
    default:
      return state
  }
}

export { convertCurrencyApp }
