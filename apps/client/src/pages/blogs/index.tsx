import dayjs from 'dayjs'
import React from 'react'
import Link from 'next/link'
import to from 'await-to-js'
import { GetStaticProps, NextPage } from 'next/types'

import { request } from '@/api/request'

interface Article {
  title: string
  tag?: string
  post: number
}

interface PageProps {
  list: Article[]
}


const BlogListPage: NextPage<PageProps> = (props) => {

  const { list } = props

  const renderList = () => {
    if (list.length === 0) {
      return (
        <div>
          <p>暂无文章</p>
        </div>
      )
    }

    return list.map((article) => {
      const { title, post } = article
      return (
        <li className='mb-8' key={article.title}>
          <Link className='text-2xl hover:underline' href={`/blogs/${encodeURIComponent(title)}`}>
            {title}
          </Link>
          <div className='text-lg opacity-60 mt-1'>
            {dayjs.unix(post).format('YYYY-MM-DD')}
          </div>
        </li>
      )
    })
  }

  return (
    <div className='font-normal'>
      <Link className='float-right hover:underline' href='/blogs/old'>
        旧文章列表
      </Link>
      <h1 className='text-6xl font-bold'>Blog</h1>
      <ul className='mt-16'>
        {renderList()}
      </ul>
    </div>
  )
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {

  const [error, data] = await to(request<PageProps['list']>('/blog/list'))

  const list = (error || !data) ? [] : data

  return {
    props: {
      list,
    },
  }
}

export default BlogListPage