'use client'
import { useRequest } from 'ahooks'
import dynamic from 'next/dynamic'
import React, { useRef, useState } from 'react'
import { Button, Space, Typography, message } from 'antd'

import { Post } from '@/types'
import { EditorRef } from '@/components/editor'
import FileSelector from '@/components/FileSelector'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

interface PostEditProps {
  post?: Post
  onSave: (title: string, content: string) => Promise<void>
}

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

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center px-2">
        <div className="flex h-12 flex-grow items-center">
          <Typography.Title
            editable={{
              text: title,
              onChange: setTitle,
              triggerType: ['text'],
            }}
            level={2}
            className="!m-0 flex h-full w-full items-center"
          >
            {title.trim() ? (
              <span>{title}</span>
            ) : (
              <span className="text-xl text-gray-400">请输入标题...</span>
            )}
          </Typography.Title>
        </div>
        <Space>
          <FileSelector
            onChange={(files) => {
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
            }}
          >
            <Button>上传</Button>
          </FileSelector>
          <Button
            type="primary"
            loading={loading ? { delay: 200 } : loading}
            onClick={() => {
              if (!editorRef.current) {
                message.error('获取编辑器实例失败')
                return
              } else if (!title.trim()) {
                message.error('请输入标题')
                return
              }
              run(editorRef.current.getValue())
            }}
          >
            保存
          </Button>
        </Space>
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
