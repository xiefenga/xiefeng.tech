import React from 'react'
import { PropsWithChildren } from 'react'

import Header from './Header'
import Footer from './Footer'
import CanvasPlum from '../CanvasPlum'

const Layout: React.FC<PropsWithChildren> = (props) => {
  return (
    <div className='min-h-screen flex flex-col my-0 mx-auto max-w-7xl	px-8 dark:text-white'>
      <Header />
      <main className='flex-auto pt-10 flex'>
        <div className='w-full'>
          {props.children}
        </div>
      </main>
      <Footer />
      <CanvasPlum />
    </div>
  )
}

export default Layout