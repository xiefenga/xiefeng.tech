import React from 'react'
import Link from 'next/link'
import NavBar from './NavBar'

const Header: React.FC = () => {

  return (
    <header className='pb-10 pt-12 text-center shrink-0 relative'>
      <NavBar />
      <Link href='/'>
        <a className='uppercase tracking-widest text-gray-600 text-xl'>
          0x1461a0
        </a>
      </Link>
    </header>
  )
}

export default Header