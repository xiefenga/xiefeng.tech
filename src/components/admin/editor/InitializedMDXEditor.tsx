'use client'

import type { ForwardedRef } from 'react'
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  imagePlugin,
  codeBlockPlugin,
  tablePlugin,
  codeMirrorPlugin,
} from '@mdxeditor/editor'

import '@mdxeditor/editor/style.css'

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        // Example Plugin Usage
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        imagePlugin(),
        tablePlugin(),
        codeBlockPlugin({
          defaultCodeBlockLanguage: 'js',
        }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: 'JavaScript',
            css: 'CSS',
            shell: 'SHELL',
            json: 'JSON',
            html: 'HTML',
            ts: 'TypeScript',
            jsx: 'JSX',
            tsx: 'TSX',
            md: 'Markdown',
            java: 'Java',
            xml: 'XML',
            sql: 'SQL',
            groovy: 'Groovy',
          },
        }),
        // toolbarPlugin(),
      ]}
      {...props}
      ref={editorRef}
    />
  )
}
