import React, { PropsWithChildren } from 'react'
import Footer from './Footer'
import Header from './Header'

interface LayoutProp { }

const Layout: React.FC<PropsWithChildren<LayoutProp>> = (props) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-auto mb-12'>
        {props.children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout