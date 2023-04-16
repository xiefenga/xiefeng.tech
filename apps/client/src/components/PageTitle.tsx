import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SITE_NAME } from '@/utils/constant'

interface PageTitleProp {
  title?: string
}

const PageTitle: React.FC<PageTitleProp> = (props) => {
  
  const router = useRouter()

  const title = router.pathname !== '/'
    ? `${props.title} | ${SITE_NAME}`
    : SITE_NAME

  return (
    <Head>
      <title>{title}</title>
    </Head>
  )
}
export default PageTitle
