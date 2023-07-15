import React from 'react'
import to from 'await-to-js'

import '@/styles/home.scss'
import { request } from '@/utils/request'
import MarkdownRender from '@/components/markdown/Render'


interface RequestData {
  type: string
  content: string
}

const HomePage = async () => {

  const [error, data] = await to(request<RequestData>('/meta/detail/about'))

  const source = (error || !data) ? '暂无内容' : data.content

  return (
    <div className='home animate-main'>
      <MarkdownRender source={source} />
    </div>
  )
}

export default HomePage