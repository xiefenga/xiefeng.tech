import { getConnection } from '@/dao/connection'
import type { RowDataPacket } from 'mysql2/promise'

interface ArticleDTO {
  title: string
  post: Date
}

interface BlogDTO {
  title: string
  content: string
  post: Date
  update: Date
}

interface PageQuery {
  page: number
  size: number
}

const defaultPageQuery: PageQuery = {
  page: 1,
  size: 999,
}

export const queryBlogList = async (param: PageQuery = defaultPageQuery) => {
  const { page, size } = param
  const connection = await getConnection()
  const [data] = await connection.query('SELECT `title`, `post` FROM `blogs` ORDER BY `post` ASC LIMIT ?, ?;', [(page - 1) * size, size])
  return data as ArticleDTO[]
}

export const queryBlogDetail = async (title: string) => {
  const connection = await getConnection()
  const [data] = await connection.query('SELECT * FROM blogs WHERE title = ?', [title])
  return (data as [BlogDTO | undefined])[0] ?? null
}

interface Blog {
  title: string
  content: string
  post: Date
  update: Date
}

export const addBlog = async (blog: Blog) => {
  const connection = await getConnection()
  const [data] = await connection.query<RowDataPacket[][]>('SELECT * FROM blogs WHERE title = ?', [blog.title])
  if (data.length === 0) {
    await connection.execute('INSERT INTO blogs (`title`, `content`, `post`, `update`) VALUES (?, ?, ?, ?);', [blog.title, blog.content, blog.post, blog.update])
  }
}

interface OptionalBlog {
  title: string
  content: string
  post?: Date
  update: Date
}

export const insertOrUpdateBlog = async (blog: OptionalBlog) => {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()
    const [data] = await connection.query<RowDataPacket[][]>('SELECT * FROM blogs WHERE title = ?', [blog.title])
    if (data.length) {
      await connection.execute('UPDATE blogs SET content = ?, post = ?, updated = ? WHERE title = ?', [blog.content, blog.post, blog.update, blog.title])
    } else {
      if (!blog.post) {
        throw new Error('post is required')
      }
      await connection.execute('INSERT INTO blogs (title, content, post, update) VALUES (?, ?, ?, ?);', [blog.title, blog.content, blog.post, blog.update])
    }
    await connection.commit()
  } catch (error) {
    console.error(error)
    await connection.rollback()
  }
}