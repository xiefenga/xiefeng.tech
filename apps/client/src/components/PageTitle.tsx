import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SITE_NAME } from '@/utils/constant'

const SPECIAL_PAGES = ['/', '/404']

const PageTitle: React.FC = () => {
  
  const router = useRouter()

  const title = SPECIAL_PAGES.includes(router.pathname)
    ? SITE_NAME
    : `${decodeURIComponent(router.asPath.split('/').at(-1) as string)} | ${SITE_NAME}`

  return (
    <Head>
      <title>{title}</title>
    </Head>
  )
}
export default PageTitle
