import converterReducer, { defaultState } from "./reducers";

const currency = (code: string) => ({ value: code, label: code });

describe("converterReducer", () => {
  describe("default", () => {
    it("returns state unchanged for an unknown action", () => {
      const result = converterReducer(defaultState, {
        type: "UNKNOWN",
        payload: null,
      });
      expect(result).toBe(defaultState);
    });
  });

  describe("SET_USER", () => {
    it("sets the user", () => {
      const user = { currency: { code: "CAD", name: "Canadian Dollar" } };
      const result = converterReducer(defaultState, {
        type: "SET_USER",
        payload: user,
      });
      expect(result.user).toEqual(user);
    });
  });

  describe("SET_TIMESTAMP", () => {
    it("sets the timestamp", () => {
      const result = converterReducer(defaultState, {
        type: "SET_TIMESTAMP",
        payload: 1234567890,
      });
      expect(result.timestamp).toBe(1234567890);
    });
  });

  describe("SET_CURRENCIES", () => {
    it("sets the currencies array", () => {
      const currencies = [
        { name: "Euro", code: "EUR", symbol: "€", flag: "🇪🇺", rate: 1 },
      ];
      const result = converterReducer(defaultState, {
        type: "SET_CURRENCIES",
        payload: currencies,
      });
      expect(result.currencies).toEqual(currencies);
    });
  });

  describe("SET_CURRENCY_LIST", () => {
    it("sets the currency list", () => {
      const list = [{ value: "EUR", label: "Euro" }];
      const result = converterReducer(defaultState, {
        type: "SET_CURRENCY_LIST",
        payload: list,
      });
      expect(result.currencyList).toEqual(list);
    });
  });

  describe("SET_CURRENCY_FROM", () => {
    it("sets data.currencyFrom", () => {
      const result = converterReducer(defaultState, {
        type: "SET_CURRENCY_FROM",
        payload: currency("EUR"),
      });
      expect(result.data.currencyFrom).toEqual(currency("EUR"));
    });

    it("clears invalid.currencyFrom", () => {
      const state = {
        ...defaultState,
        invalid: { ...defaultState.invalid, currencyFrom: currency("OLD") },
      };
      const result = converterReducer(state, {
        type: "SET_CURRENCY_FROM",
        payload: currency("EUR"),
      });
      expect(result.invalid.currencyFrom).toBeUndefined();
    });
  });

  describe("SET_INVALID_CURRENCY_FROM", () => {
    it("sets invalid.currencyFrom", () => {
      const result = converterReducer(defaultState, {
        type: "SET_INVALID_CURRENCY_FROM",
        payload: currency("EUR"),
      });
      expect(result.invalid.currencyFrom).toEqual(currency("EUR"));
    });
  });

  describe("SET_CURRENCY_TO", () => {
    it("sets data.currencyTo", () => {
      const result = converterReducer(defaultState, {
        type: "SET_CURRENCY_TO",
        payload: currency("USD"),
      });
      expect(result.data.currencyTo).toEqual(currency("USD"));
    });

    it("clears invalid.currencyTo", () => {
      const state = {
        ...defaultState,
        invalid: { ...defaultState.invalid, currencyTo: currency("OLD") },
      };
      const result = converterReducer(state, {
        type: "SET_CURRENCY_TO",
        payload: currency("USD"),
      });
      expect(result.invalid.currencyTo).toBeUndefined();
    });
  });

  describe("SET_INVALID_CURRENCY_TO", () => {
    it("sets invalid.currencyTo", () => {
      const result = converterReducer(defaultState, {
        type: "SET_INVALID_CURRENCY_TO",
        payload: currency("USD"),
      });
      expect(result.invalid.currencyTo).toEqual(currency("USD"));
    });
  });

  describe("SWITCH_CURRENCIES", () => {
    it("swaps currencyFrom and currencyTo", () => {
      const state = {
        ...defaultState,
        data: {
          ...defaultState.data,
          currencyFrom: currency("EUR"),
          currencyTo: currency("USD"),
        },
      };
      const result = converterReducer(state, {
        type: "SWITCH_CURRENCIES",
        payload: undefined,
      });
      expect(result.data.currencyFrom).toEqual(currency("USD"));
      expect(result.data.currencyTo).toEqual(currency("EUR"));
    });
  });

  describe("SET_AMOUNT_FROM", () => {
    it("sets data.amountFrom", () => {
      const result = converterReducer(defaultState, {
        type: "SET_AMOUNT_FROM",
        payload: 42,
      });
      expect(result.data.amountFrom).toBe(42);
    });

    it("clears invalid.amountFrom", () => {
      const state = {
        ...defaultState,
        invalid: { ...defaultState.invalid, amountFrom: 99 },
      };
      const result = converterReducer(state, {
        type: "SET_AMOUNT_FROM",
        payload: 42,
      });
      expect(result.invalid.amountFrom).toBeUndefined();
    });
  });

  describe("SET_INVALID_AMOUNT_FROM", () => {
    it("sets invalid.amountFrom", () => {
      const result = converterReducer(defaultState, {
        type: "SET_INVALID_AMOUNT_FROM",
        payload: 99,
      });
      expect(result.invalid.amountFrom).toBe(99);
    });
  });

  describe("SET_AMOUNT_TO", () => {
    it("sets data.amountTo", () => {
      const result = converterReducer(defaultState, {
        type: "SET_AMOUNT_TO",
        payload: 55.5,
      });
      expect(result.data.amountTo).toBe(55.5);
    });
  });

  describe("SET_RATE", () => {
    it("sets data.rate", () => {
      const result = converterReducer(defaultState, {
        type: "SET_RATE",
        payload: 1.23,
      });
      expect(result.data.rate).toBe(1.23);
    });
  });

  describe("SET_LOADING", () => {
    it("sets loading to false", () => {
      const result = converterReducer(defaultState, {
        type: "SET_LOADING",
        payload: false,
      });
      expect(result.loading).toBe(false);
    });

    it("sets loading to true", () => {
      const state = { ...defaultState, loading: false };
      const result = converterReducer(state, {
        type: "SET_LOADING",
        payload: true,
      });
      expect(result.loading).toBe(true);
    });
  });

  describe("SET_ERRORS", () => {
    it("sets errors", () => {
      const errors = {
        _error: "Something went wrong",
        amountFrom: "",
        currencyFrom: "",
        currencyTo: "",
      };
      const result = converterReducer(defaultState, {
        type: "SET_ERRORS",
        payload: errors,
      });
      expect(result.errors).toEqual(errors);
    });
  });
});
