import clsx from 'clsx'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Components } from 'react-markdown'

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

  return (
    <div className={clsx('markdown-render-container', className)}>
      <ReactMarkdown components={customComponents}>
        {source}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRender