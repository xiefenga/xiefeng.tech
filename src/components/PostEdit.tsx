'use client'
import React from 'react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'
import { useAsyncEffect, useRequest } from 'ahooks'
import { serialize } from 'next-mdx-remote/serialize'

import '@/styles/post.scss'
import { Post } from '@/types'
import { COMPONENT_MAP, MDX_OPTIONS } from '@/constants/mdx'
import { EditorRef } from '@/components/editor'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import FileSelector from '@/components/FileSelector'
import EditableTitle from '@/components/EditableTitle'
import { MDXRemoteSerializeResult } from 'next-mdx-remote/dist/types'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { MDXRemote } from 'next-mdx-remote'

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
  loading: () => <Skeleton className="w-full" />,
})

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mdxOptions: {
        ...MDX_OPTIONS,
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
      <div className="mb-2 flex items-center px-2 pb-1">
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
      <div className="flex h-0 flex-grow gap-1">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={40}>
            <Editor
              language="mdx"
              value={post?.content ?? ''}
              onChange={(content) => setContent(content)}
              editorRef={(ref) => (editorRef.current = ref)}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={60}>
            <article
              id="post-content"
              className="h-full overflow-auto bg-[var(--site-background)] px-6"
            >
              {mdxSource && <MDXRemote {...mdxSource} components={COMPONENT_MAP} />}
            </article>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default PostEdit
