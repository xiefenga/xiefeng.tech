import React from 'react'
import { GetStaticPathsResult, GetStaticPropsContext, NextPage } from 'next/types'

import { ArticleDto } from '@/types'
import DocTitle from '@/components/Meta/DocTitle'
import ArticleDetail from '@/components/ArticleDetail'
import { queryBlogByTitle, queryBlogPaths } from '@/api/blogs'

interface PageProps {
  metaTitle: string
  article: ArticleDto
}

const BlogDetailPage: NextPage<PageProps> = (props) => {
  const { metaTitle, article } = props
  const { title, content, createTime, updateTime } = article

  const meta = {
    createTime,
    updateTime
  }

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

  const blogPaths = await queryBlogPaths()

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