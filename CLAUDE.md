# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # Start dev server at http://localhost:3030
yarn build        # Build to dist/
yarn build:netlify  # Build to netlify/ (root) and netlify/currency/ (sub-path)
yarn preview      # Preview the production build locally
yarn lint         # ESLint check on src/ (no auto-fix — fails on any error)
yarn lint:fix     # ESLint with auto-fix on src/
```

**Tests:** Not yet added — see modernisation tasks below.

## Architecture

A single-page React 19 + TypeScript app (Vite 8) that converts amounts between currencies using live exchange rates from a private API endpoint.

**Data flow:**
1. On mount, `Converter` dispatches `fetchUserData` (ipdata.co lookup to detect user's home currency) and `fetchCurrencies` (exchange rates from `api.craigmcn.com`, then country data from `restcountries.com`).
2. State is managed by `converterReducer` in `src/hooks/reducers.ts` via React `useReducer` and exposed through `ConverterContext` (`src/hooks/context.ts`).
3. `ConverterForm` handles input (amount, from-currency, to-currency) via `SelectField` and `TextField`. The `SwitchButton` swaps the two currencies.
4. `ConverterResult` renders the converted amount once all three fields are filled.

**Key source locations:**
- `src/hooks/reducers.ts` — `converterReducer` + `defaultState`; all state shape is here.
- `src/hooks/context.ts` — `ConverterContext`; wraps state + dispatch.
- `src/utils/index.ts` — `fetchUserData` and `fetchCurrencies`; all external API calls.
- `src/types.ts` — shared TypeScript interfaces (`IConversionState`, `ICurrency`, `IConverterAction`, etc.).
- `src/components/` — presentational components.
- `src/fields/` — `SelectField` (react-select wrapper) and `TextField`.
- `src/containers/Converter.tsx` — orchestrates reducer, context, and data fetching.

**Environment variable:** `VITE_IPDATA_CO` must be set (API key for ipdata.co). In development, put it in `.env`. In CI/Netlify, set it as a secret named `VITE_IPDATA_CO`. `src/utils/index.ts` reads it via `import.meta.env.VITE_IPDATA_CO`.

**Font Awesome:** Duotone Light icons (`@fortawesome/duotone-light-svg-icons`). The kit requires `FONTAWESOME_NPM_AUTH_TOKEN` set in the environment (registry auth in `.yarnrc.yml` under the `fortawesome` scope).

**Styling:** AlbertCSS served via CDN in `index.html`. Component-level styles in `src/styles/` as Sass (`.scss`) — see modernisation tasks below.

**Netlify build:** `build:netlify` runs two sequential Vite builds: one to `netlify/` (serves at the domain root) and one to `netlify/currency/` (serves at the `/currency/` sub-path). Both use `base: './'` for relative asset paths so they work at either location.

## ESLint

Config: `eslint.config.mjs` (ESLint 9 flat config). A legacy `.eslintrc` file is also present but should be deleted — see modernisation tasks. Run `yarn lint` (read-only, fails on any error) or `yarn lint:fix`.

Key rules in force:
- Interfaces must be prefixed with `I` (e.g. `IConversionState`).
- `react/jsx-no-bind` is enabled — don't pass inline arrow functions as JSX props.
- `@typescript-eslint/member-ordering` is enabled.
- `@typescript-eslint/naming-convention` enforces `I`-prefixed interfaces.

## Modernisation tasks (in-progress)

The Vite 8 migration and Node 24 bump are done (branch `vite-migration`, not yet merged). Remaining tasks to complete before this repo is up to standard:

1. **Replace Sass with plain CSS** — convert `src/styles/currencyOptions.scss` and `src/styles/switchButton.scss` to plain `.css` files. `currencyOptions.scss` uses a Sass interpolation trick for `rgba()` (`#{rgba(#005b99, 0.1)}`); replace with a literal `rgba(0, 91, 153, 0.1)` or CSS `color-mix()`.
2. **Clean up ESLint** — delete `.eslintrc`; rewrite `eslint.config.mjs` natively without `FlatCompat`/`@eslint/eslintrc` (currently uses legacy compat shim).
3. **Vitest + Testing Library + tests** — add `vitest`, `@vitest/coverage-v8`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom`. Good test targets: `converterReducer` (unit), `fetchCurrencies` (mocked fetch), field components.
4. **`test.yml` CI workflow** — lint → build → coverage, triggered on PR and push to main. Needs `VITE_IPDATA_CO` and `FONTAWESOME_NPM_AUTH_TOKEN` secrets.
5. **Update README** — add end-user usage section (like `colours`) and developer usage section (like `unixtimestamp`).
6. **`.github/CODEOWNERS`** — add file containing `* @craigmcn`.
7. **Branch protection** — require PR, 1 approval with `@craigmcn` bypass, require `test` status check, block force push + deletion, dismiss stale reviews.
8. **Review favicon** — `index.html` already has full favicon link tags but the actual asset files (`.png`, `.ico`, `.webmanifest`, etc.) are not in the repo. Verify they are present in the Netlify deploy target or add them (see `albertcss` for working example).
