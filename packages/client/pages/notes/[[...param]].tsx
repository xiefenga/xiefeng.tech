import React from 'react'
import { join } from 'node:path'
import type { NextPage, GetStaticPropsContext, GetStaticPathsResult } from 'next'

import { initShared } from '@/utils/shared'
import NotesDir from '@/components/NotesDir'
import DocTitle from '@/components/Meta/DocTitle'
import ArticleDetail from '@/components/ArticleDetail'
import type { DirJson } from '@/utils/files'
import { Article, ArticleInfoDto } from '@/types'
import { queryNoteByPath, queryNoteList } from '@/api/notes'

const PATH_END = '__PATH_END__'

const NOTE_LIST = initShared('NOTE_LIST')

const PATH_TREE = initShared('PATH_TREE')

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

const getProperty = (obj: { [key: string]: any }, props: string) => {
  return props
    .replace(/\[(\d)\]/g, '.$1')
    .split('.')
    .reduce((obj, prop) => obj?.[prop], obj) as any
}

export async function getStaticProps(ctx: GetStaticPropsContext<PageQuery>) {

  const { params } = ctx

  const { param } = params!

  const pathTree = PATH_TREE.get()

  const noteList = NOTE_LIST.get() as ArticleInfoDto[]

  const current = !param || param.length === 0
    ? pathTree
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

export async function getStaticPaths(): Promise<GetStaticPathsResult<{} | { param: string[] }>> {

  const list = await queryNoteList()

  NOTE_LIST.set(list)

  const pathList = list.map(item => item.path.slice(1).split('/'))

  function handle(map: any, path: string[]) {
    if (path.length === 1) {
      map[path[0]] = PATH_END
    } else {
      map[path[0]] ??= {} as any
      if (map[path[0]] === PATH_END) {
        throw new Error('')
      }
      handle(map[path[0]], path.slice(1))
    }
  }

  const pathTree = pathList.reduce((tree, path) => (handle(tree, path), tree), {})

  PATH_TREE.set(pathTree)

  if (process.env.NODE_ENV === 'development') {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }

  const paths = [] as any

  return {
    paths,
    fallback: false,
  }
}

export default NotesPage


