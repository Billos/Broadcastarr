import parser from "@typescript-eslint/parser"
import typescriptPlugin from "@typescript-eslint/eslint-plugin"
import stylisticJs from "@stylistic/eslint-plugin-js"
import stylisticTs from "@stylistic/eslint-plugin-ts"

export default [
  {
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2022,
        project: "./tsconfig.json",
      },
    },
    files: ["**/*.ts"],
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      "@stylistic/js": stylisticJs,
      "@stylistic/ts": stylisticTs,
    },
    settings: {
      "import/resolver": {
        "node": {
          "extensions": [".js", ".jsx", ".ts", ".tsx"]
        }
      }
    },
    // extends: [
    //   "eslint:recommended",
    //   "plugin:@typescript-eslint/recommended",
    //   "plugin:import/recommended",
    //   "plugin:import/typescript",
    //   "airbnb-base",
    //   "airbnb-typescript/base",
    // ],
    rules: {
      "object-curly-spacing": ["error", "always"],
      "prefer-destructuring": ["error", {
        "array": true,
        "object": true
      }, {}],
      "consistent-return": "off",
      "no-param-reassign": ["error", {
        props: true,
        ignorePropertyModificationsForRegex: [".*"],
      }],
      "@stylistic/js/lines-between-class-members": ["error", "always"],
      "@stylistic/js/padding-line-between-statements": ["error", {
        blankLine: "always",
        prev: ["export", "class", "default", "function"],
        next: ["export", "class", "default", "function"],
      }],
      // Linebreaks
      "no-underscore-dangle": ["error", {
        allowAfterThis: true,
        allow: ["_id"],
      }],
    }
  }
]
