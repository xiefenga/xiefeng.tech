'use client'
import { message } from 'antd'
import dynamic from 'next/dynamic'
import { useRequest } from 'ahooks'
import React, { useRef, useState } from 'react'

import { Post } from '@/types'
import { EditorRef } from '@/components/editor'
import FileSelector from '@/components/FileSelector'
import EditableTitle from '@/components/EditableTitle'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

interface PostEditProps {
  post?: Post
  onSave: (title: string, content: string) => Promise<void>
}

// TODO: imporve editor
const PostEdit: React.FC<PostEditProps> = ({ post, onSave }) => {
  const [title, setTitle] = useState(post?.title ?? '')

  const editorRef = useRef<EditorRef>()

  const { run, loading } = useRequest(async (content: string) => await onSave(title, content), {
    manual: true,
    onSuccess: () => {
      message.success('保存成功')
    },
    onError() {
      message.error('保存失败')
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
        message.error('获取编辑器实例失败')
        return
      }
      editorRef.current?.monaco.setValue(reader.result as string)
    }
    reader.readAsText(file)
  }

  const onClick = () => {
    if (!editorRef.current) {
      message.error('获取编辑器实例失败')
      return
    } else if (!title.trim()) {
      message.error('请输入标题')
      return
    }
    run(editorRef.current.getValue())
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center px-2">
        <div className="flex h-12 flex-grow items-center pr-2">
          <EditableTitle title={title} onChange={setTitle} />
        </div>
        <div className="flex gap-2">
          <FileSelector onChange={onFileChange}>
            <button className="btn btn-neutral btn-sm">上传</button>
          </FileSelector>
          <button className="btn btn-primary btn-sm" onClick={onClick}>
            {loading && <span className="loading loading-spinner"></span>}
            保存
          </button>
        </div>
      </div>
      <div className="flex-grow">
        <Editor
          language="mdx"
          value={post?.content ?? ''}
          editorRef={(ref) => (editorRef.current = ref)}
        />
      </div>
    </div>
  )
}

export default PostEdit
