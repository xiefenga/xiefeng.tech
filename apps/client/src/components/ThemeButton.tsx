'use client'
import { useContext, useEffect } from 'react'

import { NoSSRHOC } from './NoSSR'
import { ThemeContext } from '@/context/theme'
import DarkThemeIcon from '@/icons/DarkTheme.svg'
import LightThemeIcon from '@/icons/LightTheme.svg'

const ThemeButton = () => {

  const { theme, changeTheme } = useContext(ThemeContext)

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
    changeTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <button className='w-[24px] h-[24px] flex items-center justify-center overflow-hidden cursor-pointer text-xl' onClick={toogleTheme}>
      {renderThemeIcon()}
    </button>
  )
}

export default NoSSRHOC(ThemeButton)