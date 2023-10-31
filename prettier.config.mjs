/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  semi: false,
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
}

export default config
