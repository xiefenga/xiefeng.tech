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

export const addNote = async (note: ArticleDto) => {
  return await request<ArticleDto>(BaseURL, {
    method: 'POST',
    // headers: {},
    body: JSON.stringify(note),
  })
}

export const updateNote =async (note: ArticleDto) => {
  const { id } = await queryNoteByPath(note.path)
  note.id = id
  return await request<ArticleDto>(BaseURL, {
    method: 'PUT',
    // headers: {},
    body: JSON.stringify(note),
  })
}