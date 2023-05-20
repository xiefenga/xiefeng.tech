import React from 'react'
import matter from 'gray-matter'
import getConfig from 'next/config'
import { NextPage, GetStaticProps, GetStaticPaths } from 'next/types'

import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'

import { isDev } from '@/utils/env'
import Article from '@/components/Article'

interface Article {
  title: string
  content: string
  meta: {
    created: number
    updated: number
  }
}


interface PageProps {
  article: Article
}

const BlogDetailPage: NextPage<PageProps> = (props) => {

  const { article } = props

  const { title, content, meta } = article

  return (
    <div className='m-auto max-w-3xl'>
      <Article
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

  const { rootDir } = getConfig().serverRuntimeConfig

  const oldBlogsDirPath = resolve(rootDir, process.env.OLD_BLOG_PATH as string)

  const filename = resolve(oldBlogsDirPath, `${ctx.params.title}.md`)

  if (!existsSync(filename)) {
    return {
      notFound: true,
    }
  }

  const source = await readFile(filename, 'utf-8')

  const { content, data } = matter(source)

  const title = ctx.params.title

  const { create, date, update } = data

  const meta = {} as Article['meta']

  // old article 
  if (date) {
    meta.created = new Date(date).getTime()
    meta.updated = new Date(date).getTime()
  } else {
    meta.created = new Date(create).getTime()
    meta.updated = new Date(update ?? create).getTime()
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
  if (isDev) {
    return { paths: [], fallback: 'blocking' }
  }

  const { rootDir } = getConfig().serverRuntimeConfig

  const oldBlogsDirPath = resolve(rootDir, process.env.OLD_BLOG_PATH as string)

  const files = await readdir(oldBlogsDirPath)

  const list = await Promise.all(
    files
      .filter(file => file.endsWith('.md'))
      .map(async file => file.split('.')[0])
  )

  return {
    paths: list.map((item) => ({ params: { title: item } })),
    fallback: 'blocking',
  }
}

export default BlogDetailPage