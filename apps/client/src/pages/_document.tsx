import { Html, Head, Main, NextScript } from 'next/document'

const Document = () => {
  return (
    <Html lang="zh_cn">
      <Head />
      <body>
        <Main />
        <NextScript />
        {/* <script src="//unpkg.com/mermaid@8.4.8/dist/mermaid.min.js"></script>
        <script>mermaid.initialize({'{startOnLoad: true}'});</script> */}
      </body>
    </Html>
  )
}

export default Document
