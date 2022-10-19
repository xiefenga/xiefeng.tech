export type Article = {
  id: number
  title: string
  words: number
  createdAt: string
  updatedAt: string
  cover: string
  meta: any
}

export interface ArticleDto {
  id: number
  title: string
  content: string
  path: string
  blog: boolean
  createTime: Date
  updateTime: Date
}

export interface ArticleInfoDto {
  id: number
  title: string
  path: string
  blog: boolean
  createTime: Date
  updateTime: Date
}

export type Fn = () => void

export interface RafFnOptions {
  immediate?: boolean
}

export interface Pausable {
  isActive: React.RefObject<boolean>
  pause: Fn
  resume: Fn
}