import { revalidatePath } from 'next/cache'

import { prisma } from '@/server/db'
import PostAction from './PostAction'
import { getPostList } from '@/server/post'

const ServerPostList = async () => {
  const list = await getPostList()

  return (
    <ul className="p-4">
      {list.map((post) => (
        <li key={post.id} className="flex h-14 items-center border-b px-1 py-2">
          <div>{post.title}</div>
          <PostAction
            id={post.id}
            title={post.title}
            onDeletePost={async (id) => {
              'use server'
              await prisma.post.delete({ where: { id } })
              revalidatePath('/post')
              revalidatePath(`/post/${encodeURIComponent(post.title)}`, 'page')
            }}
          />
        </li>
      ))}
    </ul>
  )
}

export default ServerPostList
