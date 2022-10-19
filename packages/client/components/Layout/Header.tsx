import React from 'react'
import Link from 'next/link'

const Header: React.FC = () => {
  return (
    <header className='pb-10 pt-12 text-center shrink-0 relative'>
      <nav className='absolute right-20 top-0 p-4 grid grid-flow-col gap-x-5'>
        <Link href='/blogs'>
          <a>Blogs</a>
        </Link>
        <Link href='/notes'>
          <a>Notes</a>
        </Link>
        <Link href='https://github.com/xiefenga'>
          <a>Github</a>
        </Link>
      </nav>
      <Link href="/">
        <a className='uppercase tracking-widest text-gray-600 text-xl'>0x1461a0</a>
      </Link>
    </header>
  )
}

export default Header