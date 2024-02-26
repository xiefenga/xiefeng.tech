import React from 'react'
import { inter } from '@/constants/fonts'

import '@/styles/admin/global.css'

const AdminRootLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.variable}>{children}</body>
    </html>
  )
}

export default AdminRootLayout
