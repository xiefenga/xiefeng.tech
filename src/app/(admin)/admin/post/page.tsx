import Link from 'next/link'
import { Suspense } from 'react'

import { Button } from '@/components/ui/button'
import PostList from '@/components/admin/post-list'
import PostListSkeleton from '@/components/PostListSkeleton'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '文章列表',
  description: '文章列表',
}

// TODO: clean route memo always
const PostPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between px-2 pb-2">
        <h1 className="text-2xl font-bold leading-loose">文章列表</h1>
        <Button asChild>
          <Link href="/admin/post/add">新增</Link>
        </Button>
      </div>
      <Suspense fallback={<PostListSkeleton />}>
        <PostList />
      </Suspense>
    </div>
  )
}

export default PostPage
