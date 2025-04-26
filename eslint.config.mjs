import { defineConfig, globalIgnores } from "eslint/config";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import { fixupPluginRules } from "@eslint/compat";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import stylistic from '@stylistic/eslint-plugin'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["**/node_modules", "**/webpack.config.js"]), {
    extends: compat.extends(
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    ),

    plugins: {
        react,
        "react-hooks": fixupPluginRules(reactHooks),
        "@typescript-eslint": typescriptEslint,
        '@stylistic': stylistic
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
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
}]);
