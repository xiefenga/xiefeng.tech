import React from 'react'
import SideNav from '@ui/admin/side-nav'
import Header from '@ui/admin/layout/header'

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex h-screen flex-col bg-base-300">
      <Header />
      <div className="flex h-[calc(100vh-64px)]">
        <SideNav />
        <div className="h-full flex-grow overflow-auto p-4">{children}</div>
      </div>
    </div>
  )
}

export default AdminLayout
