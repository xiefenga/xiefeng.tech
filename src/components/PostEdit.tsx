'use client'
import React from 'react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'
import { MDXRemote } from 'next-mdx-remote'
import { useAsyncEffect, useRequest } from 'ahooks'
import { serialize } from 'next-mdx-remote/serialize'

import '@/styles/post.scss'
import { Post } from '@/types'
import { COMPONENT_MAP } from '@/constants/mdx'
import { EditorRef } from '@/components/editor'
import { Button } from '@/components/ui/button'
import FileSelector from '@/components/FileSelector'
import EditableTitle from '@/components/EditableTitle'
import { MDXRemoteSerializeResult } from 'next-mdx-remote/dist/types'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

interface PostEditProps {
  post?: Post
  onSave: (title: string, content: string) => Promise<void>
}

// TODO: imporve editor
const PostEdit: React.FC<PostEditProps> = ({ post, onSave }) => {
  const [title, setTitle] = React.useState(post?.title ?? '')

  const [content, setContent] = React.useState(post?.content ?? '')

  const [mdxSource, setMdxSource] = React.useState<MDXRemoteSerializeResult>()

  useAsyncEffect(async () => {
    const mdxSource = await serialize(content, {
      mdxOptions: {
        development: process.env.NODE_ENV === 'development',
      },
    })
    setMdxSource(mdxSource)
  }, [content])

  const editorRef = React.useRef<EditorRef>()

  const { run, loading } = useRequest(async (content: string) => await onSave(title, content), {
    manual: true,
    onSuccess: () => {
      toast.success('保存成功')
    },
    onError() {
      toast.error('保存失败')
    },
  })

  const onFileChange = (files: FileList | null) => {
    if (!files || !files.length) {
      return
    }
    const file = files[0]!
    if (!title.trim()) {
      setTitle(file.name)
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (!editorRef.current) {
        toast.error('获取编辑器实例失败')
        return
      }
      editorRef.current?.monaco.setValue(reader.result as string)
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center px-2">
        <div className="flex h-12 flex-grow items-center pr-2">
          <EditableTitle title={title} onChange={setTitle} />
        </div>
        <div className="flex gap-2">
          <FileSelector onChange={onFileChange}>
            <Button variant="secondary">上传</Button>
          </FileSelector>
          <Button onClick={() => run(content)}>
            {loading && <span className="loading loading-spinner"></span>}
            保存
          </Button>
        </div>
      </div>
      <div className="flex h-0 flex-grow">
        <div className="h-full w-1/2">
          <Editor
            language="mdx"
            value={post?.content ?? ''}
            onChange={(content) => setContent(content)}
            editorRef={(ref) => (editorRef.current = ref)}
          />
        </div>
        <div className="h-full w-1/2  bg-[var(--site-background)] py-2">
          <article id="post-content" className="h-full overflow-auto px-6">
            {mdxSource && <MDXRemote {...mdxSource} components={COMPONENT_MAP} />}
          </article>
        </div>
      </div>
    </div>
  )
}

export default PostEdit
