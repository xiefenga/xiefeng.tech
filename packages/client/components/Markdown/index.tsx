import React from 'react'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'

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
    >
      {article}
    </ReactMarkdown>
  )
}

export default Markdown