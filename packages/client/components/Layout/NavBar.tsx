import Link from 'next/link'
import React, { useState } from 'react'
import { RssFill } from 'styled-icons/bootstrap'
import { Github } from 'styled-icons/remix-line'
import { Sun } from 'styled-icons/heroicons-outline'
import { Moon } from 'styled-icons/boxicons-regular'

type Theme = 'light' | 'dark'

const ThemeMap = {
  light: Sun,
  dark: Moon,
}

const Nav: React.FC = () => {
  const detectTheme = (): Theme => {
    // return localStorage.getItem('theme') as Theme ?? 'light'
    return 'light'
  }

  const [theme, setTheme] = useState<Theme>(detectTheme)

  const onThemeChange = () => {
    const targetTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(targetTheme)
    localStorage.setItem('theme', targetTheme)
  }

  const renderTheme = () => {
    const ThemeIcon = ThemeMap[theme]
    return <ThemeIcon />
  }

  return (
    <nav className='absolute right-20 top-0 p-4 grid grid-flow-col gap-x-5'>
      <Link href='/blogs'>
        <a>Blogs</a>
      </Link>

      <Link href='/notes'>
        <a>Notes</a>
      </Link>

      <Link href='/ideas'>
        <a>Ideas</a>
      </Link>

      <Link href='https://github.com/xiefenga'>
        <a className='w-5 flex items-center'>
          <Github />
        </a>
      </Link>
      <div className='w-4 flex items-center cursor-pointer'>
        <RssFill />
      </div>
      <div 
        onClick={onThemeChange}
        className='w-5 cursor-pointer flex items-center' 
      >
        {renderTheme()}
      </div>

    </nav>
  )
}

export default Nav