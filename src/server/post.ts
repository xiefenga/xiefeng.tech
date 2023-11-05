import { prisma } from './db'

export const getPostList = async () => {
  const list = await prisma.post.findMany({
    orderBy: {
      created: 'desc',
    },
  })
  return list
}
