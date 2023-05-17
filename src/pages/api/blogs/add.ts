import dayjs from 'dayjs'
import { RowDataPacket } from 'mysql2/promise'
import { NextApiRequest, NextApiResponse } from 'next/types'

import { getConnection } from '@/dao/connection'

interface BlogDTO {
  title: string
  content: string
  post: number
  update: number
}

const transformDate = (date: number) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(404).json({ code: 404, message: 'Not Found' })
  } else {
    const { title, content, post, update } = req.body as BlogDTO
    const connection = await getConnection()
    const [data] = await connection.query<RowDataPacket[][]>('SELECT * FROM blogs WHERE title = ?', [title])
    if (data.length === 0) {
      await connection.execute('INSERT INTO blogs (title, content, post, updated) VALUES (?, ?, ?, ?);', [title, content, transformDate(post), transformDate(update)])
      res.status(200).json({ code: 200, message: 'OK' })
    } else {
      res.status(400).json({ code: 400, message: 'title has existed' })
    }
  }
}
