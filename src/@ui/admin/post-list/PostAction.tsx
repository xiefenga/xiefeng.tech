'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Popconfirm from '@/components/Popconfirm'

interface PostActionProps {
  id: number
  title: string
  onDeletePost: (id: number) => Promise<void>
}

const PostAction: React.FC<PostActionProps> = ({ id, title, onDeletePost }) => {
  const router = useRouter()

  return (
    <div className="ml-auto">
      <button className="btn btn-ghost btn-sm" onClick={() => router.push(`/admin/post/${id}`)}>
        编辑
      </button>
      <Popconfirm title={`确定删除《${title}》?`} onConfirm={() => onDeletePost(id)}>
        <button className="btn btn-ghost btn-sm">删除</button>
      </Popconfirm>
    </div>
  )
}

export default PostAction
