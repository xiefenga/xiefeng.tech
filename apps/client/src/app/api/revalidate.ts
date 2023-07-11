import { NextApiRequest, NextApiResponse } from 'next/types'

type AssertRoutes = (routes: any[]) => asserts routes is string[]

const assertRoutes: AssertRoutes = (routes) => {
  if (routes.some((route) => typeof route !== 'string')) {
    throw new Error('Invalid routes')
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== 'PUT') {
    return res.status(404).end()
  }

  if (req.headers.revalidate_token !== process.env.REVALIDATE_TOKEN) {
    return res.status(401).json({ code: 401, message: 'Unauthorized' })
  }

  const { routes = [] } = req.body

  try {
    assertRoutes(routes)
  } catch (error) {
    return res.status(400).json({ code: 400, message: 'invalie routes', error })
  }

  try {
    await Promise.all(
      routes.map((route) => res.revalidate(route))
    )
    return res.json({ code: 200, message: 'OK' })
  } catch (error) {
    return res.status(500).send({ code: 500, message: 'Error revalidating', error })
  }
}