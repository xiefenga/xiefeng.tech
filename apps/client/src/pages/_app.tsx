import React from 'react'
import type { AppProps } from 'next/app'
import useNProgress from '@/hooks/useNProgress'
import { useConsole } from '@/hooks/useConsole'
import '@/styles/globals.css'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {

  useConsole()
  
  useNProgress()

  return (
    <Component {...pageProps} />
  )
}


export default App