import { Feed } from 'feed'
import path from 'node:path'
import fs from 'node:fs/promises'
import { unified } from 'unified'
import remarkMDX from 'remark-mdx'
import remarkParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'
import { notFound } from 'next/navigation'

import { env } from '@/env.mjs'
import { getPostList } from '@/server/post'
import { PUBLIC_DIR } from '@/constants/files'

const author = {
  name: env.SITE_AUTHOR,
  email: env.EMAIL_URL,
  link: env.SITE_URL,
}

const baseOption = {
  author,
  title: env.SITE_AUTHOR,
  description: `${env.SITE_AUTHOR}'s Site`,
  id: env.SITE_URL,
  link: env.SITE_URL,
  copyright: `CC BY-NC-SA 4.0 ${env.SITE_START_YEAR} © ${env.SITE_AUTHOR}`,
  feedLinks: {
    json: `${env.SITE_URL}/feed.json`,
    atom: `${env.SITE_URL}/feed.atom`,
    rss: `${env.SITE_URL}/feed.xml`,
  },
}

const generateFeed = async () => {
  const postList = await getPostList()

  const processor = unified().use(remarkParse).use(remarkMDX).use(remarkRehype).use(stringify)

  // const updated = postList.reduce((updated, item) => {
  //   return Math.max(new Date(item.updated).getTime(), updated)
  // }, 0)

  postList.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())

  const feed = new Feed({
    ...baseOption,
    updated: new Date(),
  })

  await Promise.all(
    postList.map(async (post) => {
      return feed.addItem({
        title: post.title,
        author: [author],
        id: `${env.SITE_URL}/post/${post.title}`,
        link: `${env.SITE_URL}/post/${post.title}`,
        description: post.title,
        content: (await processor.process(post.content)).toString(),
        published: post.created,
        date: post.updated,
      })
    }),
  )
  return feed
}

const writeFeed = async (feed: Feed) => {
  await Promise.all([
    fs.writeFile(path.resolve(PUBLIC_DIR, 'feed.xml'), feed.rss2()),
    fs.writeFile(path.resolve(PUBLIC_DIR, 'feed.json'), feed.json1()),
    fs.writeFile(path.resolve(PUBLIC_DIR, 'feed.atom'), feed.atom1()),
  ])
}

const FeedAutoGenerateHiddenPage = async () => {
  if (env.NODE_ENV === 'production') {
    const feed = await generateFeed()
    await writeFeed(feed)
  }

  notFound()
}

export default FeedAutoGenerateHiddenPage
