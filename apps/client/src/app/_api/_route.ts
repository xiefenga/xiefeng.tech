import { z } from 'zod'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

import { request } from '@/utils/request'
import { toJSON } from '@/utils/stream'

const BlogSchema = z.object({
  title: z.string(),
  content: z.string(),
  post: z.number(),
  update: z.number(),
})

const BlogSchemaList = z.array(BlogSchema)

export async function PUT(apiRequest: NextRequest) {

  if (apiRequest.headers.get('revalidate_token') !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ code: 401, message: 'Unauthorized' }, { status: 401 })
  }

  if (!apiRequest.body) {
    return NextResponse.json({ code: 400, message: 'empty arguments' }, { status: 400 })
  }

  const body = await toJSON(apiRequest.body)

  try {
    const list = BlogSchemaList.parse(body)
    await Promise.all(
      list.map(async (blog) => {
        await request('/blog/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(blog),
        })
      })
    )
    revalidateTag('blog/list')
    revalidatePath('src/app/blogs')
    list.forEach((blog) => revalidatePath(`app/blogs/${blog.title}`))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ code: 400, message: 'invalid arguments', error }, { status: 400 })
    }
    return NextResponse.json({ code: 500, message: 'update blogs failed', error }, { status: 500 })
  }
  return NextResponse.json({ code: 200, message: 'OK' })
}