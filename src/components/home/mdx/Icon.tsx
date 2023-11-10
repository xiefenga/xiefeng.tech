'use client'
import clsx from 'clsx'
import { Icon, IconProps } from '@iconify/react'

interface MdxIconProps extends IconProps {
  size?: number
  vertical?: string | number
}

const MdxIcon: React.FC<MdxIconProps> = ({ style = {}, size, vertical, className, ...props }) => {
  return (
    <Icon
      {...props}
      style={{ ...style, fontSize: size, verticalAlign: vertical }}
      className={clsx('inline-flex select-none pl-1 text-[#888]', className)}
    />
  )
}

export default MdxIcon
