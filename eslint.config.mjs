import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  globalIgnores(["**/node_modules"]),
  js.configs.recommended,
  typescriptEslint.configs["flat/eslint-recommended"],
  ...typescriptEslint.configs["flat/recommended"],
  react.configs.flat.recommended,
  reactHooks.configs["recommended-latest"],
  prettierConfig,
  {
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
      "no-console": "warn",
      "react/function-component-definition": [
        2,
        { namedComponents: "function-declaration" },
      ],
      "react/jsx-no-bind": "error",
      "react/jsx-pascal-case": "error",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/member-ordering": "error",

      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],

          custom: {
            regex: "^I[A-Z]",
            match: true,
          },
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          ignoreRestSiblings: true,
        },
      ],
    },
  },
]);
