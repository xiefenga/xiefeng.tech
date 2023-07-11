import React from 'react'
import type { AppProps } from 'next/app'

import Layout from '@/components/Layout'
import PageTitle from '@/components/PageTitle'
import useNProgress from '@/hooks/useNProgress'
import { useConsole } from '@/hooks/useConsole'

import '@/styles/globals.css'
import '@/styles/post.scss'
import '@/styles/toc.css'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {

  useConsole()
  
  useNProgress()

  return (
    <Layout>
      <PageTitle />
      <Component {...pageProps} />
    </Layout>
  )
}


export default App