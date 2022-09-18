import React from 'react'
import Link from 'next/link'

const Header: React.FC = () => {
  return (
    <header className='pb-10 pt-12 text-center shrink-0'>
      <Link href="/">
        <a className='uppercase tracking-widest text-gray-600'>0x1461a0</a>
      </Link>
    </header>
  )
}

export default Header