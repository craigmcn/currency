import { Dispatch } from "react";
import IPData from "ipdata";
import {
  IConverterAction,
  IIpData,
  ICurrency,
  ICurrencyOption,
} from "../types";

const ipdataco = import.meta.env.VITE_IPDATA_CO ?? "";

const currencyMetadata: {
  [code: string]: { name: string; symbol: string; flag: string };
} = {
  AUD: { name: "Australian dollar", symbol: "A$", flag: "🇦🇺" },
  BGN: { name: "Bulgarian lev", symbol: "лв", flag: "🇧🇬" },
  BRL: { name: "Brazilian real", symbol: "R$", flag: "🇧🇷" },
  CAD: { name: "Canadian dollar", symbol: "CA$", flag: "🇨🇦" },
  CHF: { name: "Swiss franc", symbol: "Fr", flag: "🇨🇭" },
  CNY: { name: "Chinese yuan", symbol: "¥", flag: "🇨🇳" },
  CZK: { name: "Czech koruna", symbol: "Kč", flag: "🇨🇿" },
  DKK: { name: "Danish krone", symbol: "kr", flag: "🇩🇰" },
  EUR: { name: "European euro", symbol: "€", flag: "🇪🇺" },
  GBP: { name: "Pound sterling", symbol: "£", flag: "🇬🇧" },
  HKD: { name: "Hong Kong dollar", symbol: "HK$", flag: "🇭🇰" },
  HRK: { name: "Croatian kuna", symbol: "kn", flag: "🇭🇷" },
  HUF: { name: "Hungarian forint", symbol: "Ft", flag: "🇭🇺" },
  IDR: { name: "Indonesian rupiah", symbol: "Rp", flag: "🇮🇩" },
  ILS: { name: "Israeli new shekel", symbol: "₪", flag: "🇮🇱" },
  INR: { name: "Indian rupee", symbol: "₹", flag: "🇮🇳" },
  ISK: { name: "Icelandic króna", symbol: "kr", flag: "🇮🇸" },
  JPY: { name: "Japanese yen", symbol: "¥", flag: "🇯🇵" },
  KRW: { name: "South Korean won", symbol: "₩", flag: "🇰🇷" },
  MXN: { name: "Mexican peso", symbol: "$", flag: "🇲🇽" },
  MYR: { name: "Malaysian ringgit", symbol: "RM", flag: "🇲🇾" },
  NOK: { name: "Norwegian krone", symbol: "kr", flag: "🇳🇴" },
  NZD: { name: "New Zealand dollar", symbol: "NZ$", flag: "🇳🇿" },
  PHP: { name: "Philippine peso", symbol: "₱", flag: "🇵🇭" },
  PLN: { name: "Polish złoty", symbol: "zł", flag: "🇵🇱" },
  RON: { name: "Romanian leu", symbol: "lei", flag: "🇷🇴" },
  RUB: { name: "Russian ruble", symbol: "₽", flag: "🇷🇺" },
  SEK: { name: "Swedish krona", symbol: "kr", flag: "🇸🇪" },
  SGD: { name: "Singapore dollar", symbol: "S$", flag: "🇸🇬" },
  THB: { name: "Thai baht", symbol: "฿", flag: "🇹🇭" },
  TRY: { name: "Turkish lira", symbol: "₺", flag: "🇹🇷" },
  USD: { name: "United States dollar", symbol: "$", flag: "🇺🇸" },
  ZAR: { name: "South African rand", symbol: "R", flag: "🇿🇦" },
};

const fetchUserData = async (
  dispatch: Dispatch<IConverterAction>,
): Promise<void> => {
  const ipdata = new IPData(ipdataco);
  const data: IIpData = await ipdata?.lookup();

  if (data?.message) {
    console.warn(data.message); // eslint-disable-line no-console
  }

  dispatch({ type: "SET_USER", payload: data });
};

const fetchCurrencies = async (
  dispatch: Dispatch<IConverterAction>,
): Promise<void> => {
  let currencies: { [code: string]: number };
  let countries: ICurrency[] = [];

  try {
    const fetchRates = await fetch(
      "https://api.craigmcn.com/v1/exchange-rates/latest",
    );
    const fetchRatesJson = await fetchRates?.json();

    if (fetchRatesJson?.error) {
      throw new Error(fetchRatesJson?.error?.message);
    }
    currencies = fetchRatesJson?.rates;
    dispatch({ type: "SET_TIMESTAMP", payload: fetchRatesJson?.timestamp });

    if (currencies) {
      countries = Object.entries(currencyMetadata).reduce(
        (a: ICurrency[], [code, meta]) => {
          const rate = code === "EUR" ? 1 : currencies[code];
          if (rate !== undefined) {
            a.push({ ...meta, code, rate });
          }
          return a;
        },
        [],
      );

      countries.sort((a: ICurrency, b: ICurrency) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    }

    dispatch({ type: "SET_CURRENCIES", payload: countries });

    if (countries?.length) {
      const countryOptions = countries.map(
        (a: ICurrency): ICurrencyOption => ({
          value: a.code,
          label: a.name,
          symbol: a.symbol,
          flag: a.flag,
        }),
      );
      dispatch({ type: "SET_CURRENCY_LIST", payload: countryOptions });
    } else {
      const error = "No country list available";
      dispatch({
        type: "SET_ERRORS",
        payload: { _error: error },
      });
      throw new Error(error);
    }

    dispatch({ type: "SET_LOADING", payload: false });
  } catch (e) {
    const _error =
      e instanceof Error || e instanceof TypeError ? e.message : (e as string);
    dispatch({
      type: "SET_ERRORS",
      payload: { _error },
    });
    dispatch({ type: "SET_LOADING", payload: false });
    throw new Error(_error);
  }
};

export { fetchUserData, fetchCurrencies };
