import request from './request'
import { ArticleDto, ArticleInfoDto } from '@/types'

const BaseURL = `${process.env.API_URL}/notes`

export const queryNoteByPath = async (path: string) => {
  const api = `${BaseURL}?path=${path}`
  return await request<ArticleDto>(api)
}

export const queryNoteList = async () => {
  return await request<ArticleInfoDto[]>(BaseURL)
}