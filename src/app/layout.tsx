import clsx from 'clsx'
import React from 'react'
import { firaMono, inter, virgil } from '@/constants/fonts'

import '@/styles/globals.css'

const RootLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={clsx(inter.variable, firaMono.variable, virgil.variable)}
    >
      {children}
    </html>
  )
}

export default RootLayout
