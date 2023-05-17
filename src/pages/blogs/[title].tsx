import React from 'react'
import dayjs from 'dayjs'
import matter from 'gray-matter'
import { NextPage, GetStaticProps, GetStaticPaths, GetStaticPropsResult } from 'next/types'

import { Article } from '@/types'
import ArticleRender from '@/components/Article'
import { queryBlogDetail, queryBlogList } from '@/dao/blogs'

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

export const getStaticProps: GetStaticProps<PageProps, PageQuery> = async (ctx) => {

  // 404
  if (!ctx.params?.title) {
    return {
      notFound: true,
    }
  }

  return await getBlogDetailByDB(ctx.params.title)
}

const getBlogDetailByDB = async ($title: string): Promise<GetStaticPropsResult<PageProps>> => {

  const detail = await queryBlogDetail($title)

  // 404
  if (detail === null) {
    return {
      notFound: true,
    }
  }

  const { title, post,  update } = detail

  const { content } = matter(detail.content)

  const meta = {
    created: dayjs(post).unix(),
    updated: dayjs(update).unix(),
  }

  return {
    props: {
      article: {
        meta,
        title,
        content,
      },
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {

  if (process.env.NODE_ENV === 'development') {
    return { paths: [], fallback: 'blocking' }
  }

  const list = await queryBlogList()

  // paths: { params: { title: string } }[]
  return {
    paths: list.map((item) => ({ params: { title: item.title }})),
    fallback: 'blocking',
  }

}

export default BlogDetailPage