import React from 'react'

import SideNav from '@/components/admin/side-nav'
import Header from '@/components/admin/layout/header'

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="bg-base-300 flex h-screen flex-col">
      <Header />
      <div className="flex flex-grow">
        <SideNav />
        <div className="h-full flex-grow overflow-auto p-4">{children}</div>
      </div>
    </div>
  )
}

export default AdminLayout
