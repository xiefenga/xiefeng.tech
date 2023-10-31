/** @type {import("eslint").Linter.Config} */
const config = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: ['@typescript-eslint', 'unused-imports'],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-type-checked',
    // 'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    // // These opinionated rules are enabled in stylistic-type-checked above.
    // // Feel free to reconfigure them to your own preference.
    // '@typescript-eslint/array-type': 'off',
    // '@typescript-eslint/consistent-type-definitions': 'off',

    // '@typescript-eslint/consistent-type-imports': [
    //   'warn',
    //   {
    //     prefer: 'type-imports',
    //     fixStyle: 'inline-type-imports',
    //   },
    // ],
    // '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // '@typescript-eslint/no-misused-promises': [
    //   2,
    //   {
    //     checksVoidReturn: { attributes: false },
    //   },
    // ],
  },
}

module.exports = config
