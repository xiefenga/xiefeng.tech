import dayjs from 'dayjs'
import matter from 'gray-matter'
import { GetStaticPropsResult } from 'next/types'

import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

import { Article } from '@/types'

interface PageProps {
  article: Article
}

export const getBlogDetailByFS = async ($title: string): Promise<GetStaticPropsResult<PageProps>> => {

  const filename = resolve(process.env.NEW_BLOG_PATH as string, `${$title}.md`)

  if (!existsSync(filename)) {
    return {
      notFound: true,
    }
  }

  const source = await readFile(filename, 'utf-8')

  const title = $title

  const { content, data } = matter(source)

  const { create, date, update } = data

  const meta = {} as Article['meta']

  // old article 
  if (date) {
    meta.created = dayjs(date).unix()
    meta.updated = dayjs(date).unix()
  } else {
    meta.created = dayjs(create).unix()
    meta.updated = dayjs(update ?? create).unix()
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