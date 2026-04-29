# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # Start dev server at http://localhost:3030
yarn build        # Build to dist/
yarn build:netlify  # Build to netlify/ (root) and netlify/currency/ (sub-path)
yarn preview      # Preview the production build locally
yarn format       # Prettier on all files
yarn lint         # ESLint check on src/ (no auto-fix — fails on any error)
yarn lint:fix     # ESLint with auto-fix on src/
```

**Tests:** Not yet added — see modernization tasks below.

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

**Styling:** AlbertCSS served via CDN in `index.html`. Component-level styles in `src/styles/` as plain CSS (`.css`).

**Netlify build:** `build:netlify` runs two sequential Vite builds: one to `netlify/` (serves at the domain root) and one to `netlify/currency/` (serves at the `/currency/` sub-path). Both use `base: './'` for relative asset paths so they work at either location.

## ESLint + Prettier

Formatting is handled by Prettier (`.prettierrc`): single quotes, semicolons, 2-space indent. Run `yarn format` to apply. `.vscode/settings.json` sets Prettier as the default formatter with `formatOnSave`.

ESLint (`eslint.config.mjs`, ESLint 9 flat config, no `.eslintrc`) handles code quality only. Run `yarn lint` (read-only, fails on any error) or `yarn lint:fix`.

Rules in force:

- `no-console` — warn
- `react/function-component-definition` — named components must be function declarations, not arrow functions
- `react/jsx-no-bind` — no inline arrow functions as JSX props
- `react/jsx-pascal-case` — component names must be PascalCase
- `@typescript-eslint/member-ordering` — consistent member ordering
- `@typescript-eslint/naming-convention` — interfaces must be prefixed with `I` (e.g. `IConversionState`)
- `@typescript-eslint/no-unused-vars` — error, with `ignoreRestSiblings: true`

## Key decisions

- **Vite `base: './'`** — both the local `dist/` build and the two Netlify builds use relative asset paths, so the same build config works when the app is served from the domain root or the `/currency/` sub-path.
- **`REACT_APP_IPDATA_CO` → `VITE_IPDATA_CO`** — Vite only exposes env vars prefixed with `VITE_`; the key was renamed in `.env` and in `src/utils/index.ts` (now uses `import.meta.env.VITE_IPDATA_CO`). Update the Netlify environment variable to match.
- **Sass removed** — the two `.scss` files had no Sass features beyond nesting and a single `rgba(hex, alpha)` interpolation. BEM nesting was expanded to flat selectors; `#{rgba(#005b99, 0.1)}` became `rgba(0, 91, 153, 0.1)`. No CSS nesting used — kept genuinely plain.
- **`jsx: "react-jsx"`** in tsconfig — uses the modern JSX transform; existing `import React from 'react'` imports in components are harmless and were left in place.
- **ESLint flat config API quirks** — `typescriptEslint.configs['flat/eslint-recommended']` is a plain object (not an array); `typescriptEslint.configs['flat/recommended']` is an array (spread with `...`). For react-hooks, use `reactHooks.configs['recommended-latest']` — the `'recommended'` key is the legacy string-array format and will fail in flat config.
- **Prettier over `@stylistic`** — removed `@stylistic/eslint-plugin` in favour of Prettier + `eslint-config-prettier`. All formatting rules stripped from ESLint; `ecmaVersion: 5` and `sourceType: 'script'` bugs in the old config were fixed, which surfaced 12 real `comma-dangle` errors (auto-fixed).
- **`.vscode/settings.json` committed** — `.gitignore` changed from `.vscode` → `.vscode/*` + `!.vscode/settings.json` so project editor settings are shared.

## Modernization tasks (in-progress)

Branch `vite-migration` — 6 commits, not yet merged to main:

- [x] Migrate Webpack + Babel → Vite 8; bump Node to 24
- [x] Replace Sass with plain CSS; remove `sass` devDependency
- [x] Clean up ESLint — deleted `.eslintrc`; rewrote `eslint.config.mjs` natively; removed `@eslint/compat` and `@eslint/eslintrc`
- [x] Add Prettier; streamline ESLint to quality rules only; remove `@stylistic/eslint-plugin`
- [ ] **Vitest + Testing Library + tests** — add `vitest`, `@vitest/coverage-v8`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom`. Good test targets: `converterReducer` (unit — all action types), `fetchCurrencies` (mocked `fetch`), field components.
- [ ] **`test.yml` CI workflow** — lint → build → coverage, triggered on PR and push to main. Needs `VITE_IPDATA_CO` and `FONTAWESOME_NPM_AUTH_TOKEN` secrets.
- [ ] **Update README** — add end-user usage section (like `colours`) and developer usage section (like `unixtimestamp`).
- [ ] **`.github/CODEOWNERS`** — add file containing `* @craigmcn`.
- [ ] **Branch protection** — require PR, 1 approval with `@craigmcn` bypass, require `test` status check, block force push + deletion, dismiss stale reviews.
- [ ] **Review favicon** — `index.html` already has full favicon link tags but the actual asset files (`.png`, `.ico`, `.webmanifest`, etc.) are not in the repo. Verify they are present in the Netlify deploy target or add them (see `albertcss` for working example).
