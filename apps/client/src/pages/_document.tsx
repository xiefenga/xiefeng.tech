import { Html, Head, Main, NextScript } from 'next/document'

const Document = () => {
  return (
    <Html lang='zh_cn'>
      <Head />
      <body className='bg-[--background-color] transition-[background-color] duration-500 ease-in-out'>
        <Main />
        <NextScript />
        {/* <Script 
          src='//unpkg.com/mermaid@8.4.8/dist/mermaid.min.js'
          strategy='beforeInteractive'
          onLoad={() => {
            mermaid.initialize({'{startOnLoad: true}'})
          }}
       /> */}
        {/* <script src="//unpkg.com/mermaid@8.4.8/dist/mermaid.min.js"></script>
        <script>mermaid.initialize({'{startOnLoad: true}'});</script> */}
      </body>
    </Html>
  )
}

export default Document
