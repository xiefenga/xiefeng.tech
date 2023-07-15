import React from 'react'
import Link from 'next/link'

import ThemeButton from '@/components/ThemeButton'

const navRoutes = [
  { text: 'blogs', link: '/blogs' },
  { text: 'notes', link: '/notes' },
  // 备忘录
  { text: 'memo', link: '/memo' },
  { text: 'thinks', link: '/thinks' },
  { text: 'tools', link: '/tools' },
]

const Header: React.FC = () => {

  const renderNavs = () => {
    return navRoutes.map((route) => (
      <Link key={route.text} href={route.link} className='nav-link'>
        {route.text}
      </Link>
    ))
  }

  return (
    <header className='flex justify-between pt-8 pb-4 animate-header'>
      <div className='flex gap-x-5 items-center'>
        <Link className='text-xl' href='/'>0x1461A0</Link>
        <nav className='header-nav grid grid-flow-col gap-x-5 pr-4'>
          {renderNavs()}
        </nav>
      </div>
      <div className='flex gap-x-5 items-center text-xl'>
        <ThemeButton />
      </div>
    </header>
  )
}

export default Header