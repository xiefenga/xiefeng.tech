'use client'
import React from 'react'
import { Typography } from 'antd'

import MDXEditor from './editor'
import { Post } from '@/types'

interface PostEditorProps {
  post: Post
}

const PostEdit: React.FC<PostEditorProps> = ({ post }) => {
  return (
    <div>
      <Typography.Title editable level={1}>
        {post.title}
      </Typography.Title>
      <MDXEditor className="border leading-loose" markdown={post.content} />
    </div>
  )
}

export default PostEdit
