import { Suspense } from 'react'
import PostList from '@ui/admin/post-list'
import PostListSkeleton from '@ui/admin/post-list/Skeleton'

export const dynamic = 'force-dynamic'

// TODO: clean route memo always
const PostPage = () => {
  return (
    <div>
      <h1 className="px-2 pb-2 text-2xl font-bold leading-loose">文章列表</h1>
      <Suspense fallback={<PostListSkeleton />}>
        <PostList />
      </Suspense>
    </div>
  )
}

export default PostPage
