import Link from 'next/link'
import LocalIcon from '@/components/home/icon/LocalIcon'

interface IconLinkProps {
  icon: string
  href: string
  current?: boolean
  email?: boolean
  className?: string
  iconClassName?: string
}

const IconLink = ({
  icon,
  email = false,
  current = false,
  href,
  className,
  iconClassName,
}: IconLinkProps) => {
  // fix "_self" can only open email client once
  const target = email ? '_parent' : current ? '_self' : '_blank'

  return (
    <Link className={className} target={target} href={email ? `mailto:` + href : href}>
      <LocalIcon className={iconClassName} icon={icon} />
    </Link>
  )
}

export default IconLink
