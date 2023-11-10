'use client'
import React from 'react'
import { Icon } from '@iconify/react'
import { useTheme } from 'next-themes'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Highlight, Prism, themes } from 'prism-react-renderer'

// add languages support
;(typeof global !== 'undefined' ? global : window).Prism = Prism

require('prismjs/components/prism-bash')
require('prismjs/components/prism-java')
require('prismjs/components/prism-groovy')
require('prismjs/components/prism-less')
require('prismjs/components/prism-scss')
require('prismjs/components/prism-json')
require('prismjs/components/prism-css-extras')
require('prismjs/components/prism-docker')
require('prismjs/components/prism-git')

interface CodeBlockProps {
  language: string
  code: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  code = code.trim()

  const { theme = 'light' } = useTheme()

  const highLightTheme = theme === 'light' ? themes.duotoneLight : themes.duotoneDark

  return (
    <Highlight code={code} language={language} theme={highLightTheme}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <div className="my-2 rounded-md bg-block-code p-2 text-sm leading-normal">
          <div className="flex items-start justify-between">
            <div className="-mt-3 select-none rounded-b bg-code-lang p-1 font-bold uppercase leading-none text-code-lang">
              {language}
            </div>
            <CopyToClipboard text={code}>
              <Icon
                icon="basil:copy-solid"
                className="cursor-pointer select-none text-xl text-icon transition-colors ease-in-out hover:text-gray-600"
              />
            </CopyToClipboard>
          </div>
          <pre className="max-h-96 overflow-auto px-2 pb-1 font-mono">
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        </div>
      )}
    </Highlight>
  )
}

export default CodeBlock
