'use client'
import React from 'react'
import { useTheme } from 'next-themes'
import LocalIcon from '@/components/icon/LocalIcon'

const supportsViewTransition = (document: Document): document is Document & SupportTransition => {
  // @ts-expect-error experimental API
  return !!document.startViewTransition
}

const ThemeToggle = () => {
  const { theme = 'light', setTheme } = useTheme()

  const themeIcon = theme === 'light' ? 'ph:sun-duotone' : 'ph:moon-fill'

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
  }

  const onClick = (e: React.MouseEvent) => {
    if (supportsViewTransition(document)) {
      const x = e.clientX
      const y = e.clientY
      const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
      const transition = document.startViewTransition(toggleTheme)
      const isDark = theme === 'dark'
      transition.ready.then(() => {
        const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
        document.documentElement.animate(
          {
            clipPath: isDark ? clipPath.reverse() : clipPath,
          },
          {
            duration: 400,
            easing: 'ease-in',
            pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
          },
        )
      })
    } else {
      toggleTheme()
    }
  }

  return <LocalIcon icon={themeIcon} onClick={onClick} className="cursor-pointer" />
}

export default ThemeToggle
