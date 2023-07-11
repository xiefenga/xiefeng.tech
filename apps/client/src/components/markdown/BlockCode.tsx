'use client'
import React, { PropsWithChildren } from 'react'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import * as HighterStyles from 'react-syntax-highlighter/dist/cjs/styles/prism'

// duotoneSpace
// ghcolors
// hopscotch
// materialLight
// oneLight
// prism

interface BlockCodeProps {
  language: string
}

const BlockCode: React.FC<PropsWithChildren<BlockCodeProps>> = (props) => {

  const { language, children } = props

  return (
    <div className='block-code-container'>
      <SyntaxHighlighter
        codeTagProps={{}}
        language={language}
        style={HighterStyles.duotoneSpace}
        customStyle={{ fontSize: 16, background: 'none', margin: 0, padding: 0, lineHeight: 'inherit', overflow: 'initial', fontFamily: 'inherit', border: 'none' }}
      >
        {children as string}
      </SyntaxHighlighter>
    </div>
  )
}

export default BlockCode