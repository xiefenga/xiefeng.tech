import React from 'react'
import Link from 'next/link'

import LocalIcon from '@/components/home/icon/LocalIcon'

interface SiteLinkProps {
  href: string
  text: string
  replace?: boolean
}

const SiteLink: React.FC<SiteLinkProps> = ({ href, text, replace }) => {
  return (
    <div className="flex items-center font-mono">
      <LocalIcon className="text-xl" icon="iconamoon:arrow-right-2" />
      <Link className="link-border" replace={replace} href={href}>
        {text}
      </Link>
    </div>
  )
}

export default SiteLink
