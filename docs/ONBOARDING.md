# Onboarding guide

Welcome! This document explains how the Currency Converter app is put together, in plain English. It's aimed at junior and intermediate developers who are new to this codebase (or coming back after a while away). For quick command references and repo-specific conventions, see the root [CLAUDE.md](../CLAUDE.md) — this doc is the "why" and "how it fits together" companion to that.

## What the app does

A single page where you type an amount, pick a "from" currency and a "to" currency, and see the converted amount update automatically using live exchange rates. It also tries to guess your home currency from your IP address on load, so the "from" field is pre-filled.

Live at [craigmcn.com/currency](https://www.craigmcn.com/currency/).

## The tech stack, briefly

- **React 19 + TypeScript**, built with **Vite 8**. No server-side rendering — it's a client-side single-page app (SPA).
- **react-select** for the currency dropdowns.
- **Font Awesome** (Duotone Light icon set) for icons.
- **AlbertCSS** (Craig's own CSS framework) loaded via a `<link>` tag in `index.html` — there's no CSS-in-JS or Tailwind here, just plain `.css` files for anything AlbertCSS doesn't cover.
- **Vitest + React Testing Library** for unit/component tests, **Playwright** for end-to-end browser tests.
- Hosted on **Netlify**, which also runs a small serverless function that proxies the exchange-rate API.

If you've worked in any typical React + TypeScript + Vite app before, this will feel familiar. There's no Redux, no React Query, no router beyond a single page — it's intentionally simple.

## Pages

There is exactly **one page**. This is not a multi-route app — there's no React Router, no `/about`, nothing. Everything lives under the single `<App>` component:

```
App
├── Header (site title + logo, links back to craigmcn.com)
└── Main
    ├── <h1>Convert a currency</h1>
    └── Converter (the actual app — see "Data flow" below)
```

If a future feature needs a second page, that would be a meaningful architectural change (adding a router) — flag it rather than bolting something on.

## Components — what does what

All components live in `src/components/` (presentational/UI pieces) and `src/fields/` (form input wrappers). Here's the map:

| Component         | File                                 | Job                                                                                                                                                 |
| ----------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `App`             | `src/App.tsx`                        | Top-level shell: renders `Header`, `Main`, and `Converter`.                                                                                         |
| `Header`          | `src/components/Header.tsx`          | Site header with the logo and page title.                                                                                                           |
| `Main`            | `src/components/Main.tsx`            | Layout wrapper (`<main>`) for page content.                                                                                                         |
| `Converter`       | `src/containers/Converter.tsx`       | The orchestrator — see below. This is a "container" (has logic/state), everything else is mostly "presentational" (just renders props).             |
| `ConverterForm`   | `src/components/ConverterForm.tsx`   | The input side: two currency dropdowns, the amount field, and the swap button. Owns all the validation logic (e.g. "currencies must be different"). |
| `ConverterResult` | `src/components/ConverterResult.tsx` | The output side: shows the converted amount, the exchange rate, and when the rates were last updated.                                               |
| `SwitchButton`    | `src/components/SwitchButton.tsx`    | The ⇄ button that swaps "from" and "to" currencies.                                                                                                 |
| `Card`            | `src/components/Card.tsx`            | Generic bordered/titled box — used to wrap the result panel.                                                                                        |
| `Loader`          | `src/components/Loader.tsx`          | Spinner shown while currencies/rates are still loading.                                                                                             |
| `Error`           | `src/components/Error.tsx`           | Small inline error message with a warning icon.                                                                                                     |
| `Logo`            | `src/components/Logo.tsx`            | Inline SVG logo used in the header.                                                                                                                 |
| `SelectField`     | `src/fields/SelectField.tsx`         | Wraps `react-select` for the currency dropdowns (flags, symbols, custom option rendering).                                                          |
| `TextField`       | `src/fields/TextField.tsx`           | Wraps a plain `<input>` for the amount field, with label + error display.                                                                           |

A good rule of thumb when you're new: **`Converter` decides what the data is; everything else decides how it looks.**

## Data flow — how state moves through the app

This is the part that trips people up first, so read it slowly.

1. **On mount**, `Converter` (`src/containers/Converter.tsx`) fires two async calls in a `useEffect`:
   - `fetchUserData` — looks up the visitor's location via ipdata.co to guess their home currency.
   - `fetchCurrencies` — fetches today's exchange rates from `/api/exchange-rates/latest` (see "Where exchange rates come from" below), then builds a sorted list of currencies with names, symbols, and flags.
2. Both functions live in `src/utils/index.ts` and take a `dispatch` function as an argument — they don't return data directly, they **dispatch actions** to update state.
3. State is managed with React's built-in `useReducer`, not Redux or any external library. The reducer function is `converterReducer` in `src/hooks/reducers.ts`. It's a big `switch` statement — one `case` per action type (e.g. `SET_CURRENCY_FROM`, `SET_AMOUNT_TO`, `SET_ERRORS`). If you need to see everything the app's state can look like, `defaultState` in that same file is the full shape.
4. That state and its `dispatch` function are shared with the rest of the tree via `ConverterContext` (`src/hooks/context.ts`) — a plain React Context, no provider library. `Converter` wraps `ConverterForm` and `ConverterResult` in `<ConverterContext.Provider>`.
5. `ConverterForm` reads from context, validates user input (e.g. rejects picking the same currency twice, rejects non-numeric amounts), and dispatches actions back into the reducer.
6. Whenever `amountFrom`, `currencyFrom`, or `currencyTo` all have valid values, a `useEffect` inside `ConverterForm` computes the exchange rate and the converted amount, and dispatches `SET_RATE` / `SET_AMOUNT_TO`.
7. `ConverterResult` just reads the final numbers out of context and renders them — it does no calculation itself.

So the pattern is: **fetch → dispatch → reducer updates state → context re-renders consumers → user interacts → dispatch → repeat.** There's no data flowing "up" through props — everything goes through the shared reducer/context pair.

### Where exchange rates come from

`fetchCurrencies` calls the relative path `/api/exchange-rates/latest`. That's **not** a real backend endpoint baked into the frontend — it's a Netlify Function (`functions/exchange-rates.js`) that proxies [exchangeratesapi.io](https://exchangeratesapi.io) using a server-side secret (`EXCHANGE_RATES_API_KEY`), so the API key never ships to the browser. The mapping from path to function is set up in `netlify.toml`.

**Important gotcha:** plain `yarn dev` (just Vite) does **not** proxy that path — it'll return the SPA's `index.html` instead of JSON, causing a confusing `"Unexpected token '<'"` error. Only `netlify dev` actually runs the function locally. Playwright e2e tests work around this by mocking both the exchange-rate call and the ipdata.co call with `page.route(...)` rather than hitting either backend for real.

### Currency metadata

The list of supported currencies (names, symbols, flag emoji) is hardcoded in `currencyMetadata` in `src/utils/index.ts` — it's not fetched from anywhere. The live _rates_ come from the API; the _display info_ (e.g. "🇬🇧 Pound sterling, £") is maintained by hand in that file. If a new currency needs supporting, that's the place to add it.

## External APIs

The app talks to two external services. Neither is called directly from the browser with a hardcoded third-party URL — both are wrapped so API keys stay out of the client bundle where possible.

### 1. ipdata.co — home currency detection

- **What it's for:** guesses the visitor's country/currency from their IP address, so the "from" currency field can be pre-filled.
- **Called from:** `fetchUserData` in `src/utils/index.ts`, via the [`ipdata`](https://www.npmjs.com/package/ipdata) npm package (not a raw `fetch` call).
- **Auth:** API key is `VITE_IPDATA_CO`, read via `import.meta.env.VITE_IPDATA_CO`. Because it's `VITE_`-prefixed, it's baked into the **client** bundle and is visible to anyone who inspects the built JS — this is how ipdata.co's client-side key model works, it's not a mistake.
- **Failure behavior:** if the lookup fails or returns a `message` field (ipdata's way of signalling an error, e.g. a bad/missing key), the app logs a warning to the console and simply doesn't pre-fill a currency — it does not block the rest of the app from working.
- **In tests:** always mocked (`vi.mock("ipdata", ...)` in `src/App.test.tsx` and `src/utils/index.test.ts`; `page.route("https://api.ipdata.co/**", ...)` in the Playwright e2e spec). Nothing in the test suite hits the real service.

### 2. exchangeratesapi.io — live exchange rates

- **What it's for:** the actual currency conversion rates (EUR-denominated).
- **Called from:** the browser fetches the **relative** path `/api/exchange-rates/latest` (see `fetchCurrencies` in `src/utils/index.ts`) — it never talks to exchangeratesapi.io directly.
- **What actually happens:** that relative path is handled by a Netlify Function, `functions/exchange-rates.js`, which server-side fetches `https://api.exchangeratesapi.io/v1/latest?access_key=...` and forwards the response back to the browser. The route mapping (`/api/exchange-rates/latest` → this function) is configured in `netlify.toml`.
- **Auth:** API key is `EXCHANGE_RATES_API_KEY`, read from `process.env` **inside the Netlify Function only** — it is never `VITE_`-prefixed and never reaches the browser. This is the deliberate reason the proxy function exists instead of calling exchangeratesapi.io straight from the frontend.
- **Failure behavior:** if the key is missing, the function returns a 500 with an error message; if the upstream call throws, it returns a 502. `fetchCurrencies` surfaces either as the app's generic error state (`errors._error`), shown via the `Error` component.
- **Local dev gotcha:** plain `yarn dev` does not run Netlify Functions, so this endpoint 404s (technically it just falls through to `index.html`) under plain Vite. Use `netlify dev` if you need the real proxy locally, or otherwise mock the endpoint — see "Where exchange rates come from" above.
- **In tests:** mocked in unit tests (`fetch` is stubbed) and in Playwright (`page.route("**/api/exchange-rates/latest", ...)`). No test hits exchangeratesapi.io.

Currency **display metadata** (names, symbols, flag emoji) is not fetched from any API — it's a hardcoded lookup table (`currencyMetadata` in `src/utils/index.ts`). Only the numeric rates come from exchangeratesapi.io.

## Types

`src/types.ts` is the single source of truth for shared TypeScript interfaces — `IConversionState` (the full reducer state shape), `ICurrency`, `ICurrencyOption`, `IConverterAction`, etc. Interfaces in this codebase are prefixed with `I` (enforced by ESLint) — that's a project convention, not a TypeScript requirement.

## Tests

Two layers of tests, and they test different things:

### Unit / component tests (Vitest + React Testing Library)

Colocated next to the code they test (e.g. `src/hooks/reducers.test.ts` sits beside `reducers.ts`). Run with:

```bash
yarn test        # watch mode, good while developing
yarn test:run     # single pass, good for CI/checking before a commit
yarn coverage      # single pass + coverage report
```

What's covered:

- `converterReducer` — every action type.
- `fetchCurrencies` / `fetchUserData` — with `fetch` and `ipdata` mocked, so no real network calls happen.
- `TextField`, `SelectField` — form field wrappers in isolation.
- `ConverterForm` — an integration-style test using a _real_ `useReducer` (not a mocked `dispatch`), so it exercises the actual validation logic end to end (e.g. picking the same currency twice produces the right error).

A few sharp edges worth knowing before you write more tests here:

- The `ipdata` mock in `src/utils/index.test.ts` must be a `function`, not an arrow function — `ipdata` gets called with `new`, and arrow functions can't be constructors.
- `react-select` doesn't have a stable CSS class to query by default (no `classNamePrefix` is set), so tests find the input via `screen.getByRole('combobox')`.
- `react-select`'s `onChange` handler is called with two arguments — `(value, actionMeta)` — so assertions on it typically use `expect.objectContaining({ action: "select-option" })` rather than checking the full call.

### End-to-end tests (Playwright)

Live in `e2e/converter.spec.ts`, driven by `playwright.config.ts`. Run with:

```bash
yarn test:e2e
```

This spins up a real browser (Chromium) against a real `yarn dev` server and clicks through the actual UI. Because `yarn dev` doesn't proxy the exchange-rate function (see above), the spec mocks both `**/api/exchange-rates/latest` and `https://api.ipdata.co/**` with `page.route(...)` rather than depending on live data. E2E tests only run in CI, not as a pre-commit hook (starting a browser is too slow for that).

### Before committing

A Husky pre-commit hook runs automatically:

```bash
prettier --check . && yarn lint && yarn tsc -b && yarn test --run
```

If any of those fail, the commit is blocked. `yarn format` will fix Prettier issues; `yarn lint:fix` will auto-fix what it can.

## Deployment

Hosted on **Netlify**. The build config lives in `netlify.toml` at the repo root.

- `yarn build:netlify` runs **two** separate Vite builds — one to `netlify/` (served at the site's root domain) and one to `netlify/currency/` (served at the `/currency/` sub-path, since this app also lives as a section of craigmcn.com). Both builds use relative asset paths (`base: './'` in Vite config) so the same bundle works at either location without hardcoding paths.
- The Netlify Function (`functions/exchange-rates.js`) is deployed alongside the static site and handles the `/api/exchange-rates/latest` proxy in production — this is why the app works in production/`netlify dev` but not under plain `yarn dev`.
- Required environment variables in Netlify: `VITE_IPDATA_CO` (ipdata.co API key, baked into the client bundle at build time), `FONTAWESOME_NPM_AUTH_TOKEN` (private npm registry auth for the Font Awesome icon packages, needed at install time), and `EXCHANGE_RATES_API_KEY` (server-side only, used by the Netlify Function — never exposed to the browser).
- CI (`.github/workflows/test.yml`) runs on every push to `main` and on all PRs: format check → lint → build → test → Playwright e2e.

## A few things that aren't obvious from reading the code

- **`VITE_` prefix matters.** Vite only exposes environment variables to client code if they're prefixed `VITE_`. `VITE_IPDATA_CO` is intentionally named that way; a plain `IPDATA_CO` would silently be `undefined` in the browser.
- **`EUR` is always present** in the currency list even if the rates API doesn't explicitly return it, because the API's rates are EUR-denominated and the code seeds the list with `rate: 1` for EUR as the reduce accumulator's base case. Don't be surprised not to find an "EUR missing" test — that branch is unreachable by construction.
- **The reducer is intentionally flat and unopinionated** — it's not using a library like Redux Toolkit or Zustand. If the state shape grows a lot more complex, that'd be worth reconsidering, but for the current one-page app it's a deliberate "no more machinery than needed" choice.

## Where to go next

- [README.md](../README.md) — user-facing usage instructions and a shorter command summary.
- [CLAUDE.md](../CLAUDE.md) — command reference, ESLint rules, and dated history of past refactors (e.g. the Webpack → Vite migration, the Sass removal).
- Open TODOs are tracked as GitHub issues in the project's [GitHub Project board](https://github.com/users/craigmcn/projects/4), not inline in this repo.
