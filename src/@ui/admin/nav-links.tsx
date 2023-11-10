'use client'
import clsx from 'clsx'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavLink } from '@/types'

interface NavLinksProps {
  links: NavLink[]
}

const NavLinks: React.FC<NavLinksProps> = ({ links }) => {
  const pathname = usePathname()

  return (
    <React.Fragment>
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={clsx(
            'm-1 flex h-10 items-center gap-2 rounded px-4 leading-10',
            pathname.startsWith(item.href) && 'bg-sky-100 text-blue-600',
          )}
        >
          {item.icon}
          <span>{item.text}</span>
        </Link>
      ))}
    </React.Fragment>
  )
}

export default NavLinks
