import React from 'react'
import dayjs from 'dayjs'
import { join } from 'node:path'
import getConfig from 'next/config'
import { fetch } from 'undici'
import { getArticle } from '@/api/articles'
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
import Back2Previous from '@/components/Back2Previous'

const {
  articleContent,
  articleContainer,
} = cssModules(styles)

interface ArticleDetailProps {
  title: string
  content: string
  meta: any
}

const ArticleDetail: React.FC<ArticleDetailProps> = props => {
  const { title, content, meta } = props
  return (
    <React.Fragment>
      <TOC source={content} />
      <Back2Top />
      <div className={articleContainer}>
        <div className='mb-8'>
          <h1 data-title className='mb-0'>{title}</h1>
          <p className='opacity-50 !-mt-2'>
            <span>Post: {dayjs(meta.birthTime).format('YYYY.MM.DD')}</span>
            <span className='font-bold'>·</span>
            <span>Update: {dayjs(meta.updateTime).format('YYYY.MM.DD')}</span>
          </p>
        </div>
        <Markdown className={articleContent} article={content} />
        <Back2Previous />
      </div>
    </React.Fragment>
  )
}

interface PageProps {
  article?: {
    title: string
    content: string
    meta: any
  }
  metaTitle: string
  articles?: Article[]
  dirs?: DirJson[]
}


const NotesPage: NextPage<PageProps> = (props) => {
  const { article, dirs, articles, metaTitle } = props

  const renderPage = () => {
    if (article) {
      const { title, content, meta } = article
      return (
        <ArticleDetail
          meta={meta}
          title={title}
          content={content}
        />
      )
    }
    return (
      <NotesDir
        dirs={dirs}
        articles={articles}
      />
    )
  }

  return (
    <React.Fragment>
      <DocTitle title={metaTitle} />
      {renderPage()}
    </React.Fragment>
  )
}

type PageQuery = {
  param: string[]
}

export async function getStaticProps(ctx: GetStaticPropsContext<PageQuery>) {

  console.log(ctx)

  const { params } = ctx

  const { param } = params!

  const { serverRuntimeConfig } = getConfig()

  const { files, dirs } = serverRuntimeConfig as { files: FileJson[], dirs: DirJson[] }

  // /notes
  if (!param || param.length === 0) {
    return {
      props: {
        metaTitle: 'notes',
        dirs: dirs.filter(dir => dir.dir === '/'),
        articles: files.filter(file => file.filename.endsWith('.md') && file.dir === '/').map(file => ({ title: file.filename.split('.')[0], ...file }))
      }
    }
  }

  // article
  const path = param.join('/')

  console.log('getStaticProps', path)

  const article = await getArticle(join('/', path))

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


  const dirJson = dirs.find(dir => dir.path === path)

  const fileJson = files.find(file => file.path.split('.')[0] === path)

  // console.log(dirJson, fileJson)

  if (fileJson) {
    const content = await readFile(fileJson.fullpath, 'utf-8')
    const title = param.at(-1)
    return {
      props: {
        metaTitle: title,
        article: {
          title: param.at(-1),
          content,
          meta: fileJson.meta
        }
      }
    }
  } else if (dirJson) {
    const floders = dirs.filter(dir => dir.dir.slice(1) === path)
    const articles = files.filter(file => file.dir.slice(1) === dirJson.path && file.filename.endsWith('md')).map(file => ({ title: file.filename.split('.')[0], ...file }))

    return {
      props: {
        metaTitle: dirJson.dirname,
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

  const baseURL = process.env.API_URL!;

  const resp = await fetch(`${baseURL}/paths/dirs`)

  const json = await resp.json()

  console.log(json)

  if (process.env.NODE_ENV === 'development') {
    return {
      paths: [],
      fallback: 'blocking'
    }
  }

  const paths = [] as any

  return {
    paths,
    fallback: false
  }
}

export default NotesPage


