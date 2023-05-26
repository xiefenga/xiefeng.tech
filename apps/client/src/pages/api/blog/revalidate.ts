import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== 'PUT') {
    return res.status(404).end()
  }

  // Check for secret to confirm this is a valid request
  if (req.headers.revalidate_token !== process.env.REVALIDATE_TOKEN) {
    return res.status(401).json({ code: 401, message: 'Unauthorized' })
  }

  const { title } = req.query

  try {
    await res.revalidate('/blogs')
    await res.revalidate(`/blogs/${title}`)
    return res.json({ code: 200, message: 'OK' })
  } catch (error) {
    return res.status(500).send({ code: 500, message: 'Error revalidating', error })
  }
}