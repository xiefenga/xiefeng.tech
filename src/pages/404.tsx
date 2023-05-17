import React from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'

const NotFound = () => {

  const router = useRouter()

  // const backHref = '/' + router.asPath.split('/').slice(1,-1).join('/')

  const goBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    router.back()
  }

  return (
    <div className='flex flex-col h-full p-8'>
      <h1 className='text-4xl font-bold'>404 - Page Not Found</h1>
      <div className='px-4'>
        <p className='text-xl py-8'>Nice to meet you tho!</p>
        <div className='pt-4 grid gap-4'>
          <div className='text-xl flex items-center'>
            <Icon className='mr-2' icon='mi:chevron-right' />
            <Link className='link' href='/' onClick={goBack}>cd ..</Link>
          </div>
          <div className='text-xl flex items-center' >
            <Icon className='mr-2' icon='mi:chevron-right' />
            <Link className='link' href='/'>back to home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound