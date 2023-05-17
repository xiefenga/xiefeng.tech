module.exports = {
  // resolve error: Parsing error : Cannot find module 'next/babel'
  // https://stackoverflow.com/a/75242860
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
    'no-unused-vars': [
      'warn',
      {
        'vars': 'all',
        'varsIgnorePattern': '^_',
        // arguments
        'args': 'after-used',
        'argsIgnorePattern': '^_',
        // destructure
        'ignoreRestSiblings': false,
        'destructuredArrayIgnorePattern': '^_',
        // try catch
        'caughtErrors': 'all',
        'caughtErrorsIgnorePattern': '^_',
      },
    ],
  },
}