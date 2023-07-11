import React from 'react'
import { Metadata } from 'next'

import '@/styles/globals.css'
import Layout from '@/components/Layout'
import { ClientTool } from '@/components/ClientTool'
import ThemeProvider from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: {
    template: '%s | 0x1461A0',
    default: '0x1461A0', 
  },
  description: '个人博客',
  authors: [
    { name: 'xiefeng' },
  ],
}

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang='zh_cn'>
      <body className='bg-[--background-color] transition-[background-color] duration-500 ease-in-out'>
        <ThemeProvider>
          <ClientTool />
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
