import React from 'react'
import Head from 'next/head'

interface DocTitleProp {
  title: string
}

const DocTitle: React.FC<DocTitleProp> = (props) => {
  const title = props.title === '/'
    ? '0x1461a0'
    : `${props.title} | 0x1461a0`
  return (
    <Head>
      <title>{title}</title>
    </Head>
  )
}


export default DocTitle