import React from 'react'
import to from 'await-to-js'
import matter from 'gray-matter'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { NextPage, GetStaticProps, GetStaticPaths } from 'next/types'

import { Article } from '@/types'
import ArticleRender from '@/components/Post'


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

  const path = '/Users/xiefeng/NOTES/blogs'

  // const [error1, json] = await to(readFile(resolve(path, '.meta'), 'utf-8'))

  // if (error1 || !json) {
  //   return {
  //     notFound: true,
  //   }
  // }

  // const { post, update } = JSON.parse(json)['blogs/' + ctx.params.title + '.md']

  const [error2, data] = await to(readFile(resolve(path, ctx.params.title + '.md'), 'utf-8'))


  if (error2 || !data) {
    return {
      notFound: true,
    }
  }

  const { content } = matter(data)

  return {
    props: {
      article: {
        title: ctx.params.title,
        content,
        meta: {
          created: Date.now(),
          updated: Date.now(),
        },
      },
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {

  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default BlogDetailPage