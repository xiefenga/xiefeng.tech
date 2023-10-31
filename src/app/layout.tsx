import clsx from 'clsx'
import React from 'react'

import '@/styles/globals.css'
import Providers from './providers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { firaMono, inter, virgil } from '@/constants/fonts'

export const metadata = {
  title: {
    template: '%s | 0x1461A0',
    default: '0x1461A0',
  },
  description: '个人博客',
  authors: [{ name: 'xiefeng' }],
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

const RootLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={clsx(inter.variable, firaMono.variable, virgil.variable)}
    >
      <body className="font-sans">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow px-20 py-10">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
