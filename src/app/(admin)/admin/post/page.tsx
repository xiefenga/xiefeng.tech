import { getPostList } from '@/server/post'
import PostList from '@/components/admin/PostList'

export const dynamic = 'force-dynamic'

const PostPage = async () => {
  const list = await getPostList()

  return (
    <div>
      <h1 className="px-2 pb-2 text-2xl font-bold leading-loose">文章列表</h1>
      <PostList
        list={list}
        onDeletePost={async (id) => {
          'use server'
          console.log(id)
        }}
      />
    </div>
  )
}

export default PostPage
