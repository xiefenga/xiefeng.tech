import React from 'react'
import { prisma } from '@/server/db'
import { notFound } from 'next/navigation'
import PostDetail from '@ui/admin/post-detail'

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
      <PostDetail
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
        }}
      />
    </React.Fragment>
  )
}

export default PostDetailPage
