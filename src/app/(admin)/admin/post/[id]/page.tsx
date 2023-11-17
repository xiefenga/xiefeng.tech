import React from 'react'
import { notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { prisma } from '@/server/db'
import PostEdit from '@/components/PostEdit'

interface PostDetailPageProps {
  params: {
    id: string
  }
}

const getPostById = async (id: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(id),
    },
  })
  return post
}

export const generateMetadata = async ({ params }: PostDetailPageProps) => {
  const post = await getPostById(params.id)
  if (!post) {
    notFound()
  }
  return {
    title: post.title,
  }
}

const PostDetailPage = async ({ params }: PostDetailPageProps) => {
  const post = await getPostById(params.id)

  if (!post) {
    notFound()
  }

  return (
    <React.Fragment>
      <PostEdit
        post={post}
        onSave={async (title, content) => {
          'use server'
          await prisma.post.update({
            where: {
              id: post.id,
            },
            data: {
              title,
              content,
              updated: new Date(),
            },
          })
          // 清除路由缓存
          revalidatePath('/admin/post')
          revalidatePath(`/admin/post/${post.id}`)
          revalidatePath('/post')
          revalidatePath(`/post/${title}`)
          // revalidatePath(`/post/${post.title}`)
        }}
      />
    </React.Fragment>
  )
}

export default PostDetailPage
