# Currency Converter

[craigmcn.com/currency](https://www.craigmcn.com/currency/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/cf023f65-b3c6-42d3-95d4-0cde937a5d38/deploy-status)](https://app.netlify.com/sites/keen-haibt-ecf9f4/deploys)
[![Test](https://github.com/craigmcn/currency/actions/workflows/test.yml/badge.svg)](https://github.com/craigmcn/currency/actions/workflows/test.yml)

Convert an amount between currencies using live exchange rates.

## Usage

1. Enter an amount in the **Amount** field.
2. Choose a **Convert from** currency.
3. Choose a **Convert to** currency.
4. The converted amount appears automatically.

Use the switch button (⇄) to swap the two currencies. The app detects your home currency on load using your IP address and pre-selects it as the default.

Exchange rates are updated daily.

## Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) built with [Vite](https://vitejs.dev/)
- [react-select](https://react-select.com/) for the currency dropdowns
- [ipdata.co](https://ipdata.co/) for IP-based home currency detection
- [AlbertCSS](https://albertcss.craigmcn.com/) for styling

## Development

```bash
yarn install
yarn dev        # dev server at http://localhost:3030
yarn build      # type-check + build to dist/
yarn lint       # ESLint (fails on any error)
yarn lint:fix   # ESLint with auto-fix
yarn format     # Prettier
yarn coverage   # Vitest + coverage report
```

Requires a `VITE_IPDATA_CO` environment variable (ipdata.co API key). Create a `.env` file at the project root:

```
VITE_IPDATA_CO=your_api_key_here
```

## Testing

Vitest + Testing Library. 39 tests across reducer, utility, and component tests.

```bash
yarn test       # watch mode
yarn test:run   # single pass
yarn coverage   # single pass with coverage report
```

## Deployment

Deployed on Netlify. The `build:netlify` script runs two sequential Vite builds — one to `netlify/` (served at the domain root) and one to `netlify/currency/` (served at the `/currency/` sub-path).

Requires `VITE_IPDATA_CO` and `FONTAWESOME_NPM_AUTH_TOKEN` set as environment variables in Netlify.
