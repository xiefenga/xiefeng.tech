import Link from 'next/link'
import getConfig from 'next/config'
import { Icon } from '@iconify/react'
import React, { useEffect } from 'react'
import { useLocalStorageState } from 'ahooks'

import { NoSSRHOC } from '@/components/NoSSR'
import DarkThemeIcon from '@/icons/DarkTheme.svg'
import LightThemeIcon from '@/icons/LightTheme.svg'

type Theme =
  | 'light'
  | 'dark'

const ThemeKey = '0x1461A0.me.theme'

const Header = () => {

  const { navRoutes, github } = getConfig().publicRuntimeConfig

  const [theme, setTheme] = useLocalStorageState<Theme>(ThemeKey, { defaultValue: 'light' })

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const renderThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <DarkThemeIcon />
      case 'light':
      default:
        return <LightThemeIcon />
    }
  }

  const toogleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <header className='flex justify-between pt-8 pb-4'>
      <div className='flex gap-x-5 items-center'>
        <Link className='text-xl' href='/'>0x1461A0</Link>
        <nav className='header-nav grid grid-flow-col gap-x-5 pr-4'>
          {navRoutes.map((route) => (
            <Link className='nav-link' key={route.text} href={route.link}>
              {route.text}
            </Link>
          ))}
        </nav>
      </div>
      <div className='flex gap-x-5 items-center text-xl'>
        <Link className='hidden text-base' target='_blank' href={github}>
          <Icon icon='logos:github-icon' />
        </Link>
        <button className='w-[24px] h-[24px] flex items-center justify-center overflow-hidden cursor-pointer text-xl' onClick={toogleTheme}>
          {renderThemeIcon()}
        </button>
      </div>
    </header>
  )
}

export default NoSSRHOC(Header)