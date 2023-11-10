import React from 'react'
import Link from 'next/link'
import { FileTextOutlined } from '@ant-design/icons'

import NavLinks from './nav-links'
import { NavLink } from '@/types'

const links: NavLink[] = [
  {
    href: '/admin/post',
    text: '文章列表',
    icon: <FileTextOutlined />,
  },
]

const SideNav = () => {
  return (
    <div className="h-screen w-[250px] flex-shrink-0 bg-white">
      <Link
        href="/admin"
        className="block py-4 text-center text-2xl font-bold leading-loose !text-inherit"
      >
        站点管理
      </Link>
      <NavLinks links={links} />
    </div>
  )
}

export default SideNav
