import dayjs from 'dayjs'
import React from 'react'
import Link from 'next/link'
import { GetStaticProps, NextPage } from 'next/types'

import { queryBlogList } from '@/dao/blogs'

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
    <div className='font-light'>
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

  const blogRecords = await queryBlogList()

  const list = blogRecords.map(item => {
    return {
      title: item.title,
      post: dayjs(item.post).unix(),
    }
  })

  return {
    props: {
      list,
    },
  }

  // const files = await readdir(process.env.NEW_BLOG_PATH as string)

  // const articles = await Promise.all(
  //   files
  //     .filter(file => file.endsWith('.md'))
  //     .map(async file => {
  //       const filename = resolve(process.env.NEW_BLOG_PATH as string, file)
  //       const source = await readFile(filename, 'utf-8')
  //       const { data } = matter(source)
  //       const { create } = data
  //       const post = dayjs(create).unix()
  //       const title = file.split('.')[0]
  //       const article: Article = { title, post }
  //       return article
  //     })
  // )

  // const list = articles.sort((a, b) => b.post - a.post)

  // return {
  //   props: {
  //     list,
  //   },
  // }
}

export default BlogListPage