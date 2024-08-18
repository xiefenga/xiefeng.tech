'use client'
import clsx from 'clsx'
import React from 'react'
import { Icon } from '@iconify/react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

interface CodeBlockProps {
  language: string
  pre: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>
}
enum CopyState {
  COPY,
  COPIED,
}

const CodeBlock: React.FC<CodeBlockProps> = ({ pre, language }) => {
  const { children, className, ...preProps } = pre

  const [code, setCode] = React.useState('')

  const codeRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    setCode(codeRef.current?.innerText ?? '')
  }, [])

  const [copyState, setCopyState] = React.useState(CopyState.COPY)

  React.useEffect(() => {
    if (copyState === CopyState.COPIED) {
      const timer = setTimeout(() => {
        setCopyState(CopyState.COPY)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [copyState])

  return (
    <pre {...preProps} className={clsx(className, 'my-2 rounded-xl px-3 py-2')}>
      <div className="mb-1 flex items-start justify-between">
        <div className="-mt-3 ml-2 select-none rounded-b bg-code-lang p-1 font-bold uppercase leading-none text-code-lang">
          {language}
        </div>
        <CopyToClipboard text={code} onCopy={() => setCopyState(CopyState.COPIED)}>
          <Icon
            icon={copyState === CopyState.COPY ? 'basil:copy-solid' : 'mdi:check'}
            className="-mb-2 cursor-pointer select-none text-xl text-icon transition-colors ease-in-out hover:text-gray-600"
          />
        </CopyToClipboard>
      </div>
      <div className="overflow-auto p-2">
        {/* @ts-expect-error ignore */}
        <code ref={codeRef} {...children.props} />
      </div>
    </pre>
  )
}

export default CodeBlock
