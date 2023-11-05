'use client'

import React from 'react'
import Link from 'next/link'
import { Layout, Menu, MenuProps } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'

type MenuItem = NonNullable<MenuProps['items']>[number]

const items: MenuItem[] = [
  {
    key: '/admin/post',
    icon: <FileTextOutlined />,
    label: <Link href="/admin/post">文章列表</Link>,
  },
]

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <Layout className="h-screen">
      <Layout.Sider theme="light">
        <Link
          href="/admin"
          className="block py-4 text-center text-2xl font-bold leading-loose !text-inherit"
        >
          站点管理
        </Link>
        <Menu items={items} />
      </Layout.Sider>
      <Layout.Content className="overflow-auto">{children}</Layout.Content>
    </Layout>
  )
}

export default AdminLayout
