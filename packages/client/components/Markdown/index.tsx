import React from 'react'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownProp {
  article: string
  className?: string
}

type T = { [key: string]: React.CSSProperties }

const Markdown: React.FC<MarkdownProp> = (props) => {
  const { className, article } = props
  return (
    <ReactMarkdown
      className={className}
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              language={match[1]}
              children={String(children).replace(/\n$/, '')}
              customStyle={{ background: 'none', margin: 0, padding: 0, lineHeight: 'inherit', overflow: 'initial', fontFamily: 'inherit' }}
              // useInlineStyles={false}
              codeTagProps={{}}
              PreTag="div"
            // {...props}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        }
      }}
    >
      {article}
    </ReactMarkdown>
  )
}

export default Markdown