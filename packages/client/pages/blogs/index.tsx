import dayjs from 'dayjs'
import React from 'react'
import Link from 'next/link'
import { NextPage } from 'next/types'

import { ArticleInfoDto } from '@/types'
import { queryBlogList } from '@/api/blogs'

interface PageProps {
  list: ArticleInfoDto[]
}

const BlogPage: NextPage<PageProps> = (props) => {
  const { list } = props

  list.map(item => dayjs(item.createTime))

  // todo: 排序 不依赖 getStaticProps 获取的顺序
  // const posts = list.sort((a, b) => dayjs(b.createTime).valueOf() - dayjs(a.createTime).valueOf())

  const posts = list
  const getYear = (a: Date | string | number) => new Date(a).getFullYear()
  const isSameYear = (a: Date | string | number, b: Date | string | number) => a && b && getYear(a) === getYear(b)

  return (
    <div className='m-auto max-w-prose'>
      <ul className='select-none'>
        {posts.map((post, index) => (
          <React.Fragment key={post.id}>
            {!isSameYear(post.createTime, posts[index - 1]?.createTime) && (
              <div className='relative h-20 pointer-events-none'>
                <span className='text-[8em] opacity-10 absolute left-[-3rem] top-[-2rem] font-bold'>
                  {getYear(post.createTime)}
                </span>
              </div>
            )}
            <Link href={`/blogs/${post.title}`}>
              <a className='mt-2 mb-6 block opacity-60 transition-opacity hover:opacity-100'>
                <li className='py-2'>
                  <div className='text-xl'>
                    {post.title}
                  </div>
                  <div className='text-base opacity-50'>
                    {dayjs(post.createTime).format('YYYY/MM/DD')}
                  </div>
                </li>
              </a>
            </Link>
          </React.Fragment>
        ))}
      </ul>
    </div>
  )
}

export async function getStaticProps() {
  const list = await queryBlogList()
  return {
    props: {
      list
    }
  }
}

export default BlogPage