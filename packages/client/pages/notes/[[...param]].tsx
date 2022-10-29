/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { join } from 'node:path'
import type { NextPage, GetStaticPropsContext, GetStaticPathsResult } from 'next'

import NotesDir from '@/components/NotesDir'
import DocTitle from '@/components/Meta/DocTitle'
import ArticleDetail from '@/components/ArticleDetail'
import type { DirJson } from '@/utils/files'
import { Article, ArticleInfoDto } from '@/types'
import { queryNoteByPath } from '@/api/notes'
import { initSharedPrimitive} from '@/utils/shared'
import { NOTE_LIST, PATH_TREE, PATH_END, initNotePathTree, pathTree2PathArrays, PathTree } from '@/utils/paths'

const DEV_LOADED = initSharedPrimitive('DEV_LOADED', false as boolean)

interface PageProps {
  article?: {
    title: string
    content: string
    meta: {
      createTime: Date
      updateTime: Date
    }
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

const getProperty = (obj: { [key: string]: any }, props: string) => {
  return props
    .replace(/\[(\d)\]/g, '.$1')
    .split('.')
    .reduce((obj, prop) => obj?.[prop], obj) as any
}

export async function getStaticProps(ctx: GetStaticPropsContext<PageQuery>) {

  const { params } = ctx

  const { param } = params!

  console.log('param', param)

  const pathTree = (PATH_TREE.get() ?? {}) as PathTree

  const noteList = (NOTE_LIST.get() ?? []) as ArticleInfoDto[]

  const current = !param || param.length === 0
    ? pathTree // for path /notes
    : getProperty(pathTree, param.join('.'))


  // generate /xx/xx 
  const logicPath = join('/', param?.join('/') ?? '')
  const dirs = [] as any
  const articles = [] as any
  console.log(logicPath)

  // article 
  if (current === PATH_END) {
    const article = await queryNoteByPath(logicPath)

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
              updateTime,
            },
          },
        },
      }
    } else {
      return {
        notFound: true,
      }
    }
  }

  // dir
  Object.entries(current).forEach(([path, value]) => {
    const rootPath = join(logicPath, path)
    if (value === PATH_END) {
      const article = noteList.find(note => note.path === rootPath)
      if (article) {
        articles.push({
          ...article,
          meta: {
            createTime: article.createTime,
            updateTime: article.updateTime,
          },
        })
      }
    } else {
      dirs.push({
        dir: logicPath,
        path: rootPath,
        dirname: path,
      })
    }
  })

  return {
    props: {
      metaTitle: param?.at(-1) ?? 'notes',
      articles: articles,
      dirs: dirs,
    },
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult<{ param: string[] }>> {

  if (process.env.NODE_ENV === 'development') {
    if ([null, 'false'].includes(DEV_LOADED.get()) ) {
      await initNotePathTree()
      DEV_LOADED.set(true)
    }
    return {
      paths: [],
      fallback: 'blocking',
    }
  }

  const pathTree = await initNotePathTree()

  const pathArrays = pathTree2PathArrays(pathTree)

  const paths = pathArrays.map(pathArray => ({ params: { param: pathArray } }))

  return {
    paths,
    fallback: false,
  }
}

export default NotesPage


