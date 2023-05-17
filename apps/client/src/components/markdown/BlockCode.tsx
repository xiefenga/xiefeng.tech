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
  // language === 'mermaid'
  //   <div className='mermaid'>{value}</div>

  return (
    <div className='block-code-container'>
      {/* <div className='relative h-3 select-none'>
        <span className='absolute left-4 px-2 bg-white rounded-b'>
          {language}
        </span>
        <span className='absolute right-4 px-2 py-1 bg-white rounded-b cursor-pointer'>
          copy
        </span>
      </div> */}
      <div className='block-code-wrapper'>
        <SyntaxHighlighter
          codeTagProps={{}}
          language={language}
          style={HighterStyles.prism}
          customStyle={{ background: 'none', margin: 0, padding: 0, lineHeight: 'inherit', overflow: 'initial', fontFamily: 'inherit', border: 'none' }}
        >
          {children as string}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

export default BlockCode