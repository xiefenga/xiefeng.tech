
export interface Article {
  title: string
  content: string
  meta: {
    created: number
    updated: number
  }
}


export type Fn = () => void

export interface RafFnOptions {
  immediate?: boolean
}

export interface Pausable {
  isActive: { current: boolean }
  pause: Fn
  resume: Fn
}

export type Theme = 'light' | 'dark'
