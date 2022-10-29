module.exports = {
  env: {
    node: true,
    browser: true,
  },
  // todo: 完善 @0x1461a0/eslint-config
  extends: [
    'next',
    '@0x1461a0/eslint-config/react-ts',
  ],
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
}