import React from 'react'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownProp {
  article: string
  className?: string
}

const Markdown: React.FC<MarkdownProp> = (prop) => {
  const { className, article } = prop
  return (
    <ReactMarkdown
      className={className}
      remarkPlugins={[remarkGfm]}
    // components={{
    //   code({ node, inline, className, children, ...props }) {
    //     const match = /language-(\w+)/.exec(className || '')
    //     console.log(match)
    //     return !inline && match ? (
    //       <SyntaxHighlighter
    //         children={String(children).replace(/\n$/, '')}
    //         // style={prism}
    //         language={match[1]}
    //         PreTag="div"
    //         {...props}
    //       />
    //     ) : (
    //       <code className={className} {...props}>
    //         {children}
    //       </code>
    //     )
    //   }
    // }}
    >
      {article}
    </ReactMarkdown>
  )
}

export default Markdown