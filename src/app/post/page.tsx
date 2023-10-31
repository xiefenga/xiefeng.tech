import dayjs from 'dayjs'
import Link from 'next/link'
import { cache } from 'react'

import { env } from '@/env.mjs'
import { prisma } from '@/server/db'

const getPostList = cache(async () => {
  const list = await prisma.post.findMany({
    orderBy: {
      created: 'desc',
    },
  })
  return list
})

const BlogList = async () => {
  const list = await getPostList()

  const renderList = () => {
    if (list.length === 0) {
      return (
        <div>
          <p>暂无文章</p>
        </div>
      )
    }

    return list.map((article) => {
      const { title, created } = article
      return (
        <li className="mb-8 truncate" key={article.title}>
          <Link className="text-2xl hover:underline" href={`/post/${encodeURIComponent(title)}`}>
            {title}
          </Link>
          <div className="mt-1 text-lg opacity-60">{dayjs(created).format('YYYY-MM-DD')}</div>
        </li>
      )
    })
  }

  return (
    <div className="mx-auto max-w-5xl animate-main font-normal">
      <Link
        target="_blank"
        className="relative z-10 float-right hover:underline"
        href={env.LEGACY_SITE_URL}
      >
        旧文章列表
      </Link>
      <div className="relative">
        <h1 className="text-6xl font-bold">Posts</h1>
        <div className="absolute -left-3 bottom-0 -z-10 h-5 w-48 bg-[#C4E7E8] opacity-60 dark:bg-[#1D1E1F]"></div>
      </div>
      <ul className="mt-16">{renderList()}</ul>
    </div>
  )
}

export default BlogList
