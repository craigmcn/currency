import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  globalIgnores(["**/node_modules"]),
  js.configs.recommended,
  typescriptEslint.configs['flat/eslint-recommended'],
  ...typescriptEslint.configs['flat/recommended'],
  react.configs.flat.recommended,
  reactHooks.configs['recommended-latest'],
  {
    plugins: {
      '@stylistic': stylistic,
    },

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      quotes: ["error", "single"],
      semi: ["error", "always"],

      '@stylistic/indent': ['error', 2, {
        SwitchCase: 2,
      }],

      "no-multi-spaces": ["error"],
      "no-trailing-spaces": "error",
      "no-console": "warn",
      "comma-dangle": ["error", "always-multiline"],

      "arrow-parens": ["error", "as-needed", {
        requireForBlockBody: true,
      }],

      "react/function-component-definition": [2, { "namedComponents": "function-declaration" }],
      "react/jsx-curly-spacing": [2, "always"],
      "react/jsx-indent": [2, 2],
      "react/jsx-no-bind": "error",

      "react/jsx-wrap-multilines": ["error", {
        declaration: "parens-new-line",
        assignment: "parens-new-line",
        return: "parens-new-line",
        arrow: "parens-new-line",
        condition: "ignore",
        logical: "ignore",
        prop: "parens-new-line",
      }],

      "react/jsx-props-no-multi-spaces": "error",
      "react/jsx-pascal-case": "error",
      "react/jsx-tag-spacing": "error",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/member-ordering": "error",

      "@typescript-eslint/naming-convention": ["error", {
        selector: "interface",
        format: ["PascalCase"],

        custom: {
          regex: "^I[A-Z]",
          match: true,
        },
      }],

      "@typescript-eslint/no-unused-vars": ["error", {
        ignoreRestSiblings: true,
      }],
    },
  },
]);
