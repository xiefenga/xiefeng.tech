'use client'
import clsx from 'clsx'
import React from 'react'
import { Icon } from '@iconify/react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

interface CodeBlockProps {
  language: string
  pre: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>
}

const CodeBlock: React.FC<CodeBlockProps> = ({ pre, language }) => {
  const { children, className, ...preProps } = pre

  const [code, setCode] = React.useState('')

  const codeRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    setCode(codeRef.current?.innerText ?? '')
  }, [])

  return (
    <pre {...preProps} className={clsx(className, 'my-2 rounded-xl px-3 py-2')}>
      <div className="mb-1 flex items-start justify-between">
        <div className="-mt-3 ml-2 select-none rounded-b bg-code-lang p-1 font-bold uppercase leading-none text-code-lang">
          {language}
        </div>
        <CopyToClipboard text={code}>
          <Icon
            icon="basil:copy-solid"
            className="-mb-2 cursor-pointer select-none text-xl text-icon transition-colors ease-in-out hover:text-gray-600"
          />
        </CopyToClipboard>
      </div>
      <div className="p-2">
        {/* @ts-expect-error ignore */}
        <code ref={codeRef} {...children.props} />
      </div>
    </pre>
  )
}

export default CodeBlock
