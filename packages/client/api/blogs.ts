import request from './request'
import { ArticleDto, ArticleInfoDto } from '@/types'

const BaseURL = `${process.env.API_URL}/blogs`

export const queryBlogList = async () => {
  return await request<ArticleInfoDto[]>(BaseURL)
}

export const queryBlogByTitle = async (title: string) => {
  const api = `${BaseURL}?title=${title}`
  return request<ArticleDto | null>(api)
}
