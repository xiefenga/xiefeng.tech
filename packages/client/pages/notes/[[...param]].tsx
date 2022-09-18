import React from 'react'
import getConfig from 'next/config'
import { readFile } from 'node:fs/promises'
import type { NextPage, GetStaticPropsContext, GetStaticPathsResult } from 'next'

import { Article } from '@/types'
import TOC from '@/components/TOC'
import Markdown from '@/components/Markdown'
import NotesDir from '@/components/NotesDir'
import Back2Top from '@/components/Back2Top'
import { cssModules } from '@/utils/styles'
import DocTitle from '@/components/Meta/DocTitle'
import styles from '@/styles/article.module.css'
import type { DirJson, FileJson } from '@/utils/files'
const {
  articleTitle,
  articleContent,
  articleContainer,
} = cssModules(styles)


interface PageProps {
  article: {
    title: string
    content: string
  }
  title: string
  articles: Article[]
  dirs: DirJson[]
}

const ArticleDetail: NextPage<PageProps> = (props) => {
  const { article, dirs, articles, title } = props

  if (article) {
    const { title, content } = article
    return (
      <React.Fragment>
        <DocTitle title={title} />
        <TOC source={content} />
        <Back2Top />
        <div className={articleContainer}>
          <h1 data-title className={articleTitle}>{title}</h1>
          <Markdown className={articleContent} article={content} />
        </div>
      </React.Fragment>
    )
  }
  return (
    <React.Fragment>
      <DocTitle title={title} />
      <NotesDir dirs={dirs} articles={articles} />
    </React.Fragment>
  )
}

type PageQuery = {
  param: string[]
}

export async function getStaticProps(ctx: GetStaticPropsContext<PageQuery>) {
  const { params } = ctx

  const { param } = params!

  const { serverRuntimeConfig } = getConfig()

  const { files, dirs } = serverRuntimeConfig as { files: FileJson[], dirs: DirJson[] }


  // /notes
  if (!param || param.length === 0) {
    return {
      props: {
        title: 'notes',
        dirs: dirs.filter(dir => dir.dir === '/'),
        articles: files.filter(file => file.filename.endsWith('.md') && file.dir === '/').map(file => ({ title: file.filename.split('.')[0], ...file }))
      }
    }
  }

  // article
  const path = param.join('/')

  console.log('getStaticProps', path)

  const dirJson = dirs.find(dir => dir.path === path)

  const fileJson = files.find(file => file.path.split('.')[0] === path)

  // console.log(dirJson, fileJson)

  if (fileJson) {
    const content = await readFile(fileJson.fullpath, 'utf-8')

    return {
      props: {
        article: {
          title: param.at(-1),
          content
        }
      }
    }
  } else if (dirJson) {
    const floders = dirs.filter(dir => dir.dir.slice(1) === path)
    const articles = files.filter(file => file.dir.slice(1) === dirJson.path && file.filename.endsWith('md')).map(file => ({ title: file.filename.split('.')[0], ...file }))

    return {
      props: {
        title: dirJson.dirname,
        articles,
        dirs: floders
      }
    }
  }

  return {
    notFound: true
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult<{} | { param: string[] }>> {

  if (process.env.NODE_ENV === 'development') {
    return {
      paths: [],
      fallback: 'blocking'
    }
  }

  const { serverRuntimeConfig } = getConfig()

  const { files, dirs } = serverRuntimeConfig as { files: FileJson[], dirs: DirJson[] }

  const paths = [
    { params: { param: [] } },
    ...files.map(file => ({ params: { param: file.path.split('.')[0].split('/') } })),
    ...dirs.map(dir => ({ params: { param: dir.path.split('/') } }))
  ]

  return {
    paths,
    fallback: false
  }
}

export default ArticleDetail


