'use client'
import clsx from 'clsx'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NavLink } from '@/types'

interface NavMenuProps {
  links: NavLink[]
}

const NavMenu: React.FC<NavMenuProps> = ({ links }) => {
  const pathname = usePathname()

  return (
    <ul className="menu menu-vertical">
      {links.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={clsx(
              'm-1 flex h-10 items-center gap-2 rounded px-4 leading-10 text-black hover:text-black',
              pathname.startsWith(item.href) && '!bg-sky-100 !text-blue-600',
            )}
          >
            {item.icon}
            <span>{item.text}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default NavMenu
