import { getPostList } from '@/server/post'
import PostList from '@/components/admin/PostList'
import { unstable_noStore } from 'next/cache'

const ServerPostList = async () => {
  unstable_noStore()
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
