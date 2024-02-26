import React from 'react'
import { FileTextOutlined } from '@ant-design/icons'

import NavMenu from './nav-menu'
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
    <div className="bg-base-100 w-[250px] flex-shrink-0 border-r">
      <NavMenu links={links} />
    </div>
  )
}

export default SideNav
