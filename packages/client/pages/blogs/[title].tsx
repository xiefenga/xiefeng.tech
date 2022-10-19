import React from 'react'
import { GetStaticPathsResult, GetStaticPropsContext, NextPage } from 'next/types'

import { getBlogPaths } from '@/api/paths'
import { queryBlogByTitle } from '@/api/blogs'
import DocTitle from '@/components/Meta/DocTitle'
import ArticleDetail from '@/components/ArticleDetail'


interface PageProps {
  metaTitle: string
  article: {
    title: string
    content: string
    meta: any
  }
}

const BlogDetailPage: NextPage<PageProps> = (props) => {
  const { metaTitle, article } = props
  const { title, content, meta } = article

  return (
    <React.Fragment>
      <DocTitle title={metaTitle} />
      <ArticleDetail
        meta={meta}
        title={title}
        content={content}
      />
    </React.Fragment>
  )
}

type PageQuery = {
  title: string
}

export async function getStaticProps(ctx: GetStaticPropsContext<PageQuery>) {
  const { params } = ctx

  const { title } = params!

  const article = await queryBlogByTitle(title);

  if (article !== null) {
    const { title, content, createTime, updateTime } = article
    return {
      props: {
        metaTitle: title,
        article: {
          title,
          content,
          meta: {
            createTime,
            updateTime
          }
        }
      }
    }
  }

  return {
    notFound: true,
  }
}
export async function getStaticPaths(): Promise<GetStaticPathsResult> {

  if (process.env.NODE_ENV === 'development') {
    return {
      paths: [],
      fallback: 'blocking'
    }
  }

  const blogPaths = await getBlogPaths()

  const paths = blogPaths.map(path => ({
    params: {
      title: path.slice(1)
    }
  }))

  return {
    paths,
    fallback: false
  }
}

export default BlogDetailPage