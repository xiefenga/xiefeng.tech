import { revalidatePath } from 'next/cache'

import { prisma } from '@/server/db'
import PostEdit from '@/components/PostEdit'

export const metadata = {
  title: '新增文章',
  description: '新增文章',
}

const AddPostPage = () => {
  return (
    <PostEdit
      onSave={async (title, content) => {
        'use server'
        await prisma.post.create({
          data: {
            title,
            content,
            created: new Date(),
            updated: new Date(),
          },
        })
        // 清除路由缓存
        revalidatePath('/admin/post')
        revalidatePath('/post')
        revalidatePath(`/post/${title}`)
      }}
    />
  )
}

export default AddPostPage
