module.exports = {
  root: true,
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
  // next project default 
  extends: 'next/core-web-vitals',
  // custom rules
  rules: {
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    // indent: ['error', 2],
    'comma-dangle': [
      'error',
      {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
      },
    ],
    'no-unused-vars': 'off',
  },
}