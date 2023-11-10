import React from 'react'

export const metadata = {
  title: '文章列表',
}

const Layout = ({ children }: React.PropsWithChildren) => {
  return <div className="h-screen overflow-auto p-4">{children}</div>
}

export default Layout
