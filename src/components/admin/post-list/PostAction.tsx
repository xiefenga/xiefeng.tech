'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/ConfirmDialog'

interface PostActionProps {
  id: number
  title: string
  onDeletePost: (id: number) => Promise<void>
}

const PostAction: React.FC<PostActionProps> = ({ id, title, onDeletePost }) => {
  const router = useRouter()

  return (
    <div className="ml-auto">
      <ConfirmDialog
        title="确认删除"
        description={
          <React.Fragment>
            确定删除 <span className="font-bold">{title}</span> ?
          </React.Fragment>
        }
        onConfirm={() => onDeletePost(id)}
      >
        <Button variant="link">删除</Button>
      </ConfirmDialog>
      <Button variant="link" onClick={() => router.push(`/admin/post/${id}`)}>
        编辑
      </Button>
    </div>
  )
}

export default PostAction
