import { cache } from 'react'

import { prisma } from './db'

export const getPostList = cache(async () => {
  const list = await prisma.post.findMany({
    orderBy: {
      created: 'desc',
    },
  })

  return list
})

export const getPostDetail = cache(async (urlTitle: string) => {
  const post = await prisma.post.findFirst({
    where: {
      title: decodeURIComponent(urlTitle),
    },
  })

  if (!post) {
    return null
  }

  const { title, created, updated, content } = post

  const meta = {
    created: created.getTime(),
    updated: updated.getTime(),
  }

  return {
    title,
    content,
    meta,
  }
})
