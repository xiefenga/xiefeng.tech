import clsx from 'clsx'
import React from 'react'
import { Icon } from '@iconify/react'

interface MetaProps {
  icon: string
  text: string
  value: string
  iconClassName?: string
}

const Meta: React.FC<MetaProps> = (props) => {

  const { icon, text, value, iconClassName } = props


  return (
    <div className='flex items-center'>
      {/* <Icon className={clsx('text-lg mr-0.5', iconClassName)} icon={icon} /> */}
      <span className='mr-1'>{text}</span>
      <span>{value}</span>
    </div>
  )
}

export default Meta