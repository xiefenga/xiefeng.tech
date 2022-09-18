// const firstUpperCase = (word: string) => {
// return word.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase())
//   return word.replace(/\b(\w)(\w*)/g, (_, $1, $2) => `${$1.toUpperCase()}${$2.toLowerCase()}`)
// }

const firstUpperCase = ([first, ...rest]: string) => `${first?.toUpperCase() ?? ''}${rest.join('')}`

export const dash2CamelCase = (dash: string) => {
  return dash.split('-').map((word, i) => i === 0 ? word : firstUpperCase(word)).join('')
}

export const cssModules = (styles: { [key: string]: string }) => {
  return Object
    .entries(styles)
    .reduce((o, [key, value]) => (o[dash2CamelCase(key)] = value, o), {} as { [key: string]: string })
}
