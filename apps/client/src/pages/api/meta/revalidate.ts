import { NextApiRequest, NextApiResponse } from 'next/types'

import { MetaTypeRouteMap } from '@/utils/constant'


type AssertMetaType = (type: any) => asserts type is keyof typeof MetaTypeRouteMap

const assertType: AssertMetaType = (type) => {
  if (!(type in MetaTypeRouteMap)) {
    throw new Error(`Invalid type: ${type}`)
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

  const { type } = req.query

  try {
    assertType(type)
  } catch(error) {
    return res.status(400).json({ code: 400, message: `Invalid type: ${type}`, error })
  }

  try {
    await res.revalidate(MetaTypeRouteMap[type])
    return res.json({ code: 200, message: 'OK' })
  } catch (error) {
    return res.status(500).send({ code: 500, message: 'Error revalidating', error })
  }
}