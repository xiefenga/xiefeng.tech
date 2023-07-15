'use client'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import RightArrowIcon from '@/icons/RightArrow.svg'

const NotFound = () => {

  const router = useRouter()

  const goBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    router.back()
  }

  return (
    <div className='flex flex-col h-full p-8 animate-main'>
      <h1 className='text-4xl font-bold'>404 - Page Not Found</h1>
      <div className='px-4'>
        <p className='text-xl py-8'>Nice to meet you tho!</p>
        <div className='pt-4 grid gap-4'>
          <div className='text-xl flex items-center'>
            <RightArrowIcon className='mr-2' />
            <Link className='border-link' href='/' onClick={goBack}>cd ..</Link>
          </div>
          <div className='text-xl flex items-center' >
            <RightArrowIcon className='mr-2' />
            <Link className='border-link' href='/'>back to home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound