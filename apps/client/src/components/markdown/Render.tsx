import clsx from 'clsx'
import React, { useMemo } from 'react'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

import BlockCode from './BlockCode'

const customComponents: Components = {
  a: ({ ...props }) => {
    return (
      <a
        {...props}
        target='_blank'
        rel='noopener noreferrer'
      >
        {props.children}
      </a>
    )
  },
  pre: ({ children }) => {
    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    )
  },
  code: ({ inline, children, className }) => {
    const matched = /language-(\w+)/.exec(className || '')?.[1]
    const language = matched?.replace(/react/, 'jsx') ?? 'javascript'
    return inline ? (
      <code className='inline'>{children}</code>
    ) : (
      <BlockCode language={language}>{children}</BlockCode>
    )
  },
}

interface MarkdownProps {
  source: string
  className?: string
}

const MarkdownRender: React.FC<MarkdownProps> = (props) => {

  const { source, className } = props

  const remarkPlugins = useMemo(() => [remarkGfm], [])

  return (
    <div className={clsx('markdown-render-container', className)}>
      <ReactMarkdown
        components={customComponents}
        remarkPlugins={remarkPlugins}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRender