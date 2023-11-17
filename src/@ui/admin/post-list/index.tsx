import { revalidatePath } from 'next/cache'

import { prisma } from '@/server/db'
import PostAction from './PostAction'
import { getPostList } from '@/server/post'
import clsx from 'clsx'

const ServerPostList = async () => {
  const list = await getPostList()

  return (
    <ul className="p-4">
      {list.map((post, index) => (
        <li
          key={post.id}
          className={clsx('flex h-14 items-center border-b px-1 py-2', index === 0 && 'border-t')}
        >
          <div>{post.title}</div>
          <PostAction
            id={post.id}
            title={post.title}
            onDeletePost={async (id) => {
              'use server'
              await prisma.post.delete({
                where: {
                  id,
                },
              })
              revalidatePath('/admin/post')
              revalidatePath('/post')
              // revalidatePath(`/post/${post.title}`)
            }}
          />
        </li>
      ))}
    </ul>
  )
}

export default ServerPostList
