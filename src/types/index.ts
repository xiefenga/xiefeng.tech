import React from 'react'

export type SVGComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

export type Theme = 'light' | 'dark'

export interface Post {
  id: number
  title: string
  content: string
}

export interface NavLink {
  href: string
  text: string
  icon: React.ReactNode
}
