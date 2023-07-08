declare module '*.txt' {
  const content: string
  export default content
}

interface NavRoute {
  text: string
  link: string
}

declare module 'next/config' {
  const getConfit: () => ({
    publicRuntimeConfig: {
      navRoutes: NavRoute[]
      oldVersion: string
      beian: string,
      nextjs: string,
      github: string,
    },
  })
  export default getConfit
}