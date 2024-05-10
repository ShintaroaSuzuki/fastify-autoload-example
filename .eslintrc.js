module.exports = {
  parser: "@typescript-eslint/parser",
  ignorePatterns: ["node_modules/", "dist/", ".eslintrc.js"],
  extends: ["eslint:recommended"],
  plugins: ["import", "@typescript-eslint"],
  rules: {
    "import/no-unresolved": "off",
    "import/order": [
      "error",
      {
        alphabetize: {
          order: "asc",
        },
      },
    ],
    "@typescript-eslint/strict-boolean-expressions": [
      "error",
      {
        allowString: false,
        allowNumber: false,
        allowNullableObject: false,
        allowNullableBoolean: false,
        allowNullableString: false,
        allowNullableNumber: false,
        allowAny: false,
      },
    ],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      {
        allowNumber: false,
        allowBoolean: false,
        allowAny: false,
        allowNullish: false,
        allowRegExp: false,
      },
    ],
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/ban-types": "error",
    "max-params": ["error", 3],
  },
  parserOptions: {
    project: ["tsconfig.json"],
    sourceType: "module",
  },
  env: {
    node: true,
    jest: true,
  },
  // test ファイル以外に functional を適用する
  overrides: [
    {
      files: ["!**/*test*"],
      extends: ["plugin:functional/recommended"],
      plugins: ["functional"],
      rules: {
        "functional/prefer-immutable-types": "off",
      },
    },
  ],
};
