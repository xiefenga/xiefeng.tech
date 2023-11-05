import React from 'react'

import '@/styles/index/global.css'
import Providers from './providers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

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
    <Providers>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow px-20 py-10">{children}</main>
        <Footer />
      </div>
    </Providers>
  )
}

export default RootLayout
