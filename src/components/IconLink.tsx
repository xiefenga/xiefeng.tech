'use client'
import Link from 'next/link'
import { Icon } from '@iconify/react'

interface IconLinkProps {
  icon: string
  href: string
  current?: boolean
  email?: boolean
}

const IconLink = ({ icon, email = false, current = false, href }: IconLinkProps) => {
  // fix "_self" can only open email client once
  const target = email ? '_parent' : current ? '_self' : '_blank'

  return (
    <Link href={email ? `mailto:` + href : href} target={target}>
      <Icon icon={icon} />
    </Link>
  )
}

export default IconLink
