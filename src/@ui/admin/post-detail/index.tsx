'use client'
import React, { useRef, useState } from 'react'
import { Button, Space, Typography, Upload, message } from 'antd'
import dynamic from 'next/dynamic'

import { Post } from '@/types'
import { EditorRef } from '@/components/editor'
import { useRequest } from 'ahooks'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

interface PostDetailProps {
  post: Post
  onSave: (title: string, content: string) => Promise<void>
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onSave }) => {
  const [title, setTitle] = useState(post.title)

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
            className="!m-0 w-full"
          >
            {title}
          </Typography.Title>
        </div>
        <Space>
          <Upload>
            <Button>上传</Button>
          </Upload>
          <Button
            type="primary"
            loading={loading ? { delay: 200 } : loading}
            onClick={() => {
              if (!editorRef.current) {
                message.error('获取编辑器实例失败')
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
          value={post.content}
          editorRef={(ref) => (editorRef.current = ref)}
        />
      </div>
    </div>
  )
}

export default PostDetail
