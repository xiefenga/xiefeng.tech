import React from 'react'
import zhCN from 'antd/locale/zh_CN'
import { ConfigProvider } from 'antd'
import StyledComponentsRegistry from './AntdRegistry'

const AdminRootLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <body daisyui-root="">
      <StyledComponentsRegistry>
        <ConfigProvider
          locale={zhCN}
          theme={{
            components: {
              Layout: {
                headerBg: '#fff',
              },
            },
          }}
        >
          {children}
        </ConfigProvider>
      </StyledComponentsRegistry>
    </body>
  )
}

export default AdminRootLayout
