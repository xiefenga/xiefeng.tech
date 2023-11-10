import React from 'react'

import { LOCAL_ICONS } from '@/constants/icons'

interface LocalIconProps extends React.SVGProps<SVGSVGElement> {
  icon: string
}

const LocalIcon: React.FC<LocalIconProps> = ({ icon, ...props }) => {
  const Icon = LOCAL_ICONS[icon] ?? React.Fragment
  return <Icon {...props} />
}

export default LocalIcon
