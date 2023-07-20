import dayjs from 'dayjs'
import to from 'await-to-js'
import Link from 'next/link'
import { Metadata } from 'next'

import { request } from '@/utils/request'

export const metadata: Metadata = {
  title: 'blogs',
}

interface Article {
  title: string
  tag?: string
  post: number
}

const queryBlogList = async () => {
  const [error, data] = await to(request<Article[]>('/blog/list', { next: { tags: ['blog/list'] } }))
  return (error || !data) ? [] : data
}


const BlogList = async () => {

  const list = await queryBlogList()

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
            {dayjs(post).format('YYYY-MM-DD')}
          </div>
        </li>
      )
    })
  }

  return (
    <div className='font-normal animate-main'>
      <Link className='float-right hover:underline' href={process.env.NEXT_PUBLIC_OLD_SITE_URL!}>
        旧文章列表
      </Link>
      <h1 className='text-6xl font-bold'>Blog</h1>
      <ul className='mt-16'>
        {renderList()}
      </ul>
    </div>
  )
}

export default BlogList