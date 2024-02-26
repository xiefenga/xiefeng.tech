import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <div className="bg-base-200 flex h-16 flex-shrink-0 items-center border-b px-8">
      <Link href="/admin" className="btn btn-ghost text-xl font-bold">
        博客后台管理
      </Link>
    </div>
  )
}

export default Header
