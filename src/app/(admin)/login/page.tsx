import { signIn } from '@/auth'
import LoginForm from '@ui/login/LoginForm'

export const metadata = {
  title: '后台登录',
  description: '登录页面',
}

const LoginPage = () => {
  return (
    <div className="h-screen w-screen">
      <LoginForm
        login={async (username, password) => {
          'use server'
          await signIn('credentials', { username, password, redirectTo: '/admin' })
        }}
      />
    </div>
  )
}

export default LoginPage
