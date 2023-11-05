import { prisma } from '@/server/db'
import { notFound } from 'next/navigation'
import PostEdit from '@/components/admin/PostEdit'

interface PostDetailtPageProps {
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

export const generateMetadata = async ({ params }: PostDetailtPageProps) => {
  const post = await getPostById(params.id)
  if (!post) {
    notFound()
  }
  return {
    title: post.title,
  }
}

const PostDetailtPage = async ({ params }: PostDetailtPageProps) => {
  const post = await getPostById(params.id)

  if (!post) {
    return <div>404</div>
  }

  return (
    <div>
      <PostEdit post={post} />
    </div>
  )
}

export default PostDetailtPage
