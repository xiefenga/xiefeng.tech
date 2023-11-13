import { getPostList } from '@/server/post'
import PostList from '@/components/admin/PostList'

const ServerPostList = async () => {
  const list = await getPostList()

  return (
    <PostList
      list={list}
      onDeletePost={async (id) => {
        'use server'
        console.log(id)
      }}
    />
  )
}

export default ServerPostList
