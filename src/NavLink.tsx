'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

type LinkProps = React.ComponentProps<typeof Link>

const NavLink: React.FC<LinkProps> = ({ href, className, ...props }) => {
  const pathname = usePathname()

  const isActive = pathname === href

  console.log(pathname)

  return (
    <Link
      {...props}
      href={href}
      className={clsx(className, isActive && 'bg-sky-100 text-blue-600')}
    />
  )
}

export default NavLink
