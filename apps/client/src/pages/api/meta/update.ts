import { z } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next/types'

import { request } from '@/api/request'
import { MetaTypeRouteMap } from '@/utils/constant'

const MetaSchema = z.object({
  type: z.enum(['about']),
  content: z.string(),
})

const MetaSchemaList = z.array(MetaSchema)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== 'POST') {
    return res.status(404).end()
  }

  if (req.headers.revalidate_token !== process.env.REVALIDATE_TOKEN) {
    return res.status(401).json({ code: 401, message: 'Unauthorized' })
  }

  try{
    const list = MetaSchemaList.parse(req.body)
    await Promise.all(
      list.map(async (blog) => {
        await request('/meta/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(blog),
        })
      })
    )
    await Promise.all(
      list.map(async (meta) => {
        await res.revalidate(MetaTypeRouteMap[meta.type])
      })
    )
    return res.json({ code: 200, message: 'OK' })
  } catch(error) {
    if(error instanceof z.ZodError) {
      return res.status(400).send({ code: 400, message: 'invalid arguments' })
    }
    return res.status(500).send({ code: 500, message: 'update blogs faild', error })
  }
}