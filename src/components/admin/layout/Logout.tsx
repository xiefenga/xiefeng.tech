'use client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface LogoutProps {
  signOut: () => Promise<void>
}

const Logout = ({ signOut }: LogoutProps) => {
  const router = useRouter()
  return (
    <button
      onClick={async () => {
        await signOut()
        toast.success('退出登录成功')
        router.push('/login')
      }}
    >
      退出登录
    </button>
  )
}

export default Logout
