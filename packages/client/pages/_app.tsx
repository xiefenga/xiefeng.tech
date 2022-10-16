import React from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'

import Layout from '@/components/Layout'
import useNProgress from '@/hooks/useNProgress'
import '@/styles/globals.css'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {

  useNProgress()

  return (
    <React.Fragment>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </React.Fragment>
  )
}

export default App
