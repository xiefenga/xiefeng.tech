import { ArticleDto } from '@/types'
import request from './request'

const baseURL = `${process.env.API_URL}/articles`

const BlogBaseURL = `${process.env.API_URL}/blogs`



export const getArticle = async (path: string) => {
  const api = `${baseURL}?path=${path}`
  return request<ArticleDto | null>(api)
}

export const queryBlogByTitle = async (title: string) => {
  const api = `${BlogBaseURL}?title=${title}`
  return request<ArticleDto | null>(api)
}