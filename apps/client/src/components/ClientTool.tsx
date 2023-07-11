'use client'
import NextTopLoader from 'nextjs-toploader'
import { useConsole } from '@/hooks/useConsole'


export const ClientTool = () => {
  useConsole()

  return (
    <NextTopLoader />
  )
}
