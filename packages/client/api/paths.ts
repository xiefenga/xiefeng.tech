import request from './request'

const baseURL = `${process.env.API_URL}/paths`

export const getBlogPaths = async () => await request<string[]>(`${baseURL}/blogs`)

export const getNotePaths = async () => await request<string[]>(`${baseURL}/notes`)

