import React from 'react'
import Head from 'next/head'

interface DocTitleProp {
  title: string
}

const siteName = '0x1461a0'.toUpperCase()

const DocTitle: React.FC<DocTitleProp> = (props) => {
  const title = props.title === '/'
    ? siteName
    : `${props.title} | ${siteName}`
  return (
    <Head>
      <title>{title}</title>
    </Head>
  )
}


export default DocTitle