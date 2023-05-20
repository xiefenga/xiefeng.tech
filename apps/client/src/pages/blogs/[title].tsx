import React from 'react'
import to from 'await-to-js'
import matter from 'gray-matter'
import { NextPage, GetStaticProps, GetStaticPaths } from 'next/types'

import { Article } from '@/types'
import { isDev } from '@/utils/env'
import { request } from '@/api/request'
import ArticleRender from '@/components/Article'

interface PageProps {
  article: Article
}

const BlogDetailPage: NextPage<PageProps> = (props) => {

  const { article } = props

  const { title, content, meta } = article

  return (
    <div className='m-auto max-w-4xl'>
      <ArticleRender
        meta={meta}
        title={title}
        content={content}
      />
    </div>
  )
}

type PageQuery = {
  title: string
}

interface ArticleDto {
  title: string
  content: string
  post: number
  update: number
}

export const getStaticProps: GetStaticProps<PageProps, PageQuery> = async (ctx) => {

  // 404
  if (!ctx.params?.title) {
    return {
      notFound: true,
    }
  }

  const [error, data] = await to(request<ArticleDto>(`/blog/detail/${encodeURIComponent(ctx.params.title)}`))

  if (error || !data) {
    return {
      notFound: true,
    }
  }

  const { title, post, update } = data

  const { content } = matter(data.content)

  return {
    props: {
      article: {
        title,
        content,
        meta: {
          created: post,
          updated: update,
        },
      },
    },
  }
}

interface ArticleItem {
  title: string
  post: number
}

export const getStaticPaths: GetStaticPaths = async () => {

  if (isDev) {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }

  const [error, data] = await to(request<ArticleItem[]>('/blog/list'))

  const list = (error || !data) ? [] : data

  return {
    paths: list.map((item) => ({ params: { title: item.title } })),
    fallback: 'blocking',
  }

}

export default BlogDetailPage