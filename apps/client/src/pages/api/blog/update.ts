import { z } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next/types'

import { request } from '@/utils/request'


const BlogSchema = z.object({
  title: z.string(),
  content: z.string(),
  post: z.number(),
  update: z.number(),
})

const BlogSchemaList = z.array(BlogSchema)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== 'POST') {
    return res.status(404).end()
  }

  // Check for secret to confirm this is a valid request
  if (req.headers.revalidate_token !== process.env.REVALIDATE_TOKEN) {
    return res.status(401).json({ code: 401, message: 'Unauthorized' })
  }

  try {
    const list = BlogSchemaList.parse(req.body)
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
    await res.revalidate('/blogs')
    await Promise.all([
      list.map(async (blog) => {
        await res.revalidate(`/blogs/${blog.title}`)
      }),
    ])
    return res.json({ code: 200, message: 'OK' })
  } catch (error) {
    if(error instanceof z.ZodError) {
      console.log(error)
      return res.status(400).send({ code: 400, message: 'invalid arguments', error })
    }
    return res.status(500).send({ code: 500, message: 'update blogs failed', error })
  }
}