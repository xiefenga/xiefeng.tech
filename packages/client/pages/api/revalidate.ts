import type { NextApiRequest, NextApiResponse } from 'next'

type Response = {
  path: string
  error?: string
  message?: string
  revalidated: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {

  console.log(req.query)

  const path = `/notes/${req.query.path}`

  // Check for secret to confirm this is a valid request
  // if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
  //   return res.status(401).json({
  //     path,
  //     revalidated: false,
  //     message: 'Invalid token'
  //   })
  // }


  try {
    await res.revalidate(path)
    res.json({
      path,
      revalidated: true,
    })
  } catch (error) {
    res.status(500)
      .send({
        path,
        revalidated: false,
        error: JSON.stringify(error)
      })
  }
}