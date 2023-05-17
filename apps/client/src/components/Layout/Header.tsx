import React from 'react'
import Link from 'next/link'
import getConfig from 'next/config'
import { Icon } from '@iconify/react'
import { useLocalStorageState } from 'ahooks'

type Theme = 'light' | 'dark' | 'auto'

const DrakThemeIcon = () => {
  return (
    <Icon icon='iconamoon:mode-dark-duotone' />
  )
}

const LightThemeIcon = () => {
  return (
    <Icon className='text-2xl' icon='iconamoon:mode-light-duotone' />
  )
}

const AutoThemeIcon = () => {
  return (
    <Icon icon='iconamoon:history-duotone' />
  )
}

const ThemeKey = '0x1461A0.me.theme'

interface NavRoute {
  text: string
  link: string
}

const Header = () => {

  const { navRoutes, github } = getConfig().publicRuntimeConfig

  const [theme, setTheme] = useLocalStorageState<Theme>(ThemeKey, { defaultValue: 'light' })

  const renderThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <LightThemeIcon />
      case 'dark':
        return <DrakThemeIcon />
      default:
        return <AutoThemeIcon />
    }
  }

  const toogleTheme = () => {
    switch (theme) {
      case 'light':
        setTheme('dark')
        break
      case 'dark':
        setTheme('auto')
        break
      default:
        setTheme('light')
        break
    }
  }

  return (
    <header className='flex justify-between pt-8 pb-4'>
      <div className='flex gap-x-5 items-center'>
        <Link className='text-xl' href='/'>0x1461A0</Link>
        <nav className='header-nav grid grid-flow-col gap-x-5 pr-4'>
          {navRoutes.map((route: NavRoute) => (
            <Link
              key={route.text}
              href={route.link}
              className='nav-link'
            >
              {route.text}
            </Link>
          ))}
        </nav>
      </div>
      <div className='flex gap-x-5 items-center text-xl'>
        <Link className='hidden text-base' target='_blank' href={github}>
          <Icon icon='logos:github-icon' />
          {/* GitHub */}
        </Link>
        <button className='w-[24px] h-[24px] flex items-center justify-center overflow-hidden cursor-pointer' onClick={toogleTheme}>
          {renderThemeIcon()}
        </button>
      </div>
    </header>
  )
}

export default Header