import React from 'react'
import { Toaster } from '@/components/ui/sonner'
import { firaMono, inter, virgil } from '@/constants/fonts'

import '@/styles/admin/global.css'
import clsx from 'clsx'

const AdminRootLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={clsx(inter.variable, firaMono.variable, virgil.variable)}
    >
      <body className="font-sans">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}

export default AdminRootLayout
