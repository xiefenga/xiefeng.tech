import React from 'react'
import SideNav from '@/@ui/admin/side-nav'

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      <SideNav />
      <div className="flex-grow overflow-y-auto">{children}</div>
    </div>
  )
}

export default AdminLayout
