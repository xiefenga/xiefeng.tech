'use client'
import React from 'react'
import { useMemoizedFn } from 'ahooks'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'
import 'monaco-editor/esm/vs/basic-languages/mdx/mdx.contribution'

export interface EditorRef {
  getValue: () => string
  monaco: monaco.editor.IStandaloneCodeEditor
}

interface EditorProps {
  value: string
  language: string
  onChange?: (value: string) => void
  editorRef?: (ref: EditorRef) => void
}

const Editor: React.FC<EditorProps> = ({ value, language, onChange, editorRef }) => {
  const monacoRef = React.useRef<HTMLDivElement>(null)

  const instanceRef = React.useRef<monaco.editor.IStandaloneCodeEditor>()

  const memoOnChange = useMemoizedFn((value: string) => onChange?.(value))

  React.useEffect(() => {
    if (!monacoRef.current) {
      return
    }

    const instance = monaco.editor.create(monacoRef.current, {
      fontSize: 14,
      value,
      language,
      automaticLayout: true,
      theme: 'vs', // 'vs-dark'
      minimap: {
        enabled: false,
      },
    })

    instanceRef.current = instance

    instance.onDidChangeModelContent(() => {
      memoOnChange(instance.getValue())
    })

    editorRef?.({
      monaco: instance,
      getValue: () => instance.getValue(),
    })

    return () => {
      instance.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div className="h-full w-full" ref={monacoRef} />
}

export default Editor
