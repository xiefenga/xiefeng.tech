import dayjs from 'dayjs'
import React from 'react'
import Link from 'next/link'
import matter from 'gray-matter'
import { useEffect } from 'react'
import { Icon } from '@iconify/react'
import { GetStaticProps, NextPage } from 'next/types'

import { resolve } from 'node:path'
import { readFile, readdir } from 'node:fs/promises'

import { SITE_NAME } from '@/utils/constant'

interface Article {
  title: string
  tag?: string
  post: number
}

interface BlogGroup {
  year: number
  articles: Article[]
}

interface PageProps {
  list: BlogGroup[]
}

interface BlogYearProps {
  year: number
}

const BlogYear: React.FC<BlogYearProps> = ({ year }) => {
  return (
    <div className='relative h-20 select-none -z-10'>
      <span className='text-9xl font-bold	opacity-10 absolute left-[-3rem] top-6'>
        {year}
      </span>
    </div>
  )
}

interface BlogLinkProps {
  tag?: string
  title: string
  post: number
}

const BlogLink: React.FC<BlogLinkProps> = (props) => {

  const { title, post, tag } = props

  const showPostDate = dayjs(post).format('MM-DD')

  useEffect(() => {
    document.title = `old-blogs | ${SITE_NAME}`
  }, [])

  return (
    <Link className='flex items-center pr-10 opacity-60 transition-opacity hover:opacity-100 mb-4' href={`/blogs/old/${title}`}>
      <div className='text-2xl relative'>
        {tag && (
          <span className='text-xs absolute -left-1 top-1.5 -translate-x-full -ml-1 rounded bg-slate-200 px-1'>
            {tag}
          </span>
        )}
        <span>{title}</span>
      </div>
      <div className='text-xl opacity-50 pl-2'>
        {showPostDate}
      </div>
    </Link>
  )
}


const BlogListPage: NextPage<PageProps> = (props) => {

  const { list } = props

  // todo: pagination

  const renderGroup = (group: BlogGroup) => {
    return (
      <div key={group.year}>
        <BlogYear year={group.year} />
        {group.articles.map((article) => (
          <li className='py-3' key={article.title}>
            <BlogLink
              tag={article.tag}
              post={article.post}
              title={article.title}
            />
          </li>
        ))}
      </div>
    )
  }

  return (
    <React.Fragment>

      <div className='max-w-5xl m-auto'>
        <div className='flex items-center justify-between'>
          <h1 className='text-6xl font-bold -ml-12'>Blog</h1>
          <Link href='/blogs' className='border-link -mr-12 flex items-center opacity-60'>
            <span>新文章列表</span>
            <Icon className='text-xl' icon='iconamoon:arrow-top-right-1-bold' />
          </Link>
        </div>
        <ul className='mt-8'>
          {list.map((group) => renderGroup(group))}
        </ul>
      </div>
    </React.Fragment>
  )
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {

  if (process.env.NODE_ENV === 'production') {
    return { props: { list: [] } }
  }

  const map = new Map<number, Article[]>()

  const files = await readdir(process.env.OLD_BLOG_PATH as string)

  await Promise.all(
    files
      .filter(file => file.endsWith('.md'))
      .map(async file => {
        const filename = resolve(process.env.OLD_BLOG_PATH as string, file)
        const source = await readFile(filename, 'utf-8')
        const { data } = matter(source)
        const { date } = data
        const postDate = new Date(date)
        const year = postDate.getFullYear()
        const post = postDate.getTime()
        const article = { title: file.split('.')[0], post }
        map.set(year, [...(map.get(year) ?? []), article].sort((a, b) => b.post - a.post))
      })
  )

  const list = Array.from(map.entries())
    .map(([year, articles]) => ({ year, articles }))
    .sort((a, b) => b.year - a.year)

  return {
    props: {
      list,
    },
  }
}

export default BlogListPage