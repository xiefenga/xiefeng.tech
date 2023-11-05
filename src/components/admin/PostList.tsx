'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button, List, Popconfirm, Space } from 'antd'

interface Post {
  id: number
  title: string
}

interface PostListProps {
  list: Post[]
  onDeletePost: (id: number) => Promise<void>
}

const PostList: React.FC<PostListProps> = ({ list, onDeletePost }) => {
  const router = useRouter()

  return (
    <List
      bordered
      rowKey="id"
      dataSource={list}
      renderItem={(post) => {
        return (
          <List.Item>
            <div>{post.title}</div>
            <Space>
              <Button type="text" onClick={() => router.push(`/admin/post/${post.id}`)}>
                编辑
              </Button>
              <Popconfirm
                placement="bottomRight"
                title={`确定删除《${post.title}》?`}
                onConfirm={() => onDeletePost(post.id)}
              >
                <Button type="text">删除</Button>
              </Popconfirm>
            </Space>
          </List.Item>
        )
      }}
    />
  )
}

export default PostList
