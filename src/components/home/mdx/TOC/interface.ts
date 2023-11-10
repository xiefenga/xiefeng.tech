export type Level = 1 | 2 | 3 | 4 | 5 | 6

export interface AnchorLink {
  id: string
  text: string
  level: Level
}

export interface TOCItem extends AnchorLink {
  children: TOCItem[]
}
