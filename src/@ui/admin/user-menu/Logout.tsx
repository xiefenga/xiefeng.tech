'use client'
import { signOut } from 'next-auth/react'

const Logout = () => {
  return (
    <button
      onClick={() => {
        signOut({ redirect: true })
      }}
    >
      登出
    </button>
  )
}

export default Logout
