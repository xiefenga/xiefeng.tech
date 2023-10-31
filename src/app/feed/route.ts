import { Feed } from 'feed'
import { unified } from 'unified'
import remarkMDX from 'remark-mdx'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

import { env } from '@/env.mjs'
import { getPostList } from '@/server/post'

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
  feedLinks: {},
}

export async function GET() {
  const postList = await getPostList()

  const processor = unified().use(remarkParse).use(remarkMDX).use(remarkRehype).use(rehypeStringify)

  const updated = postList.reduce((updated, item) => {
    return Math.max(new Date(item.updated).getTime(), updated)
  }, 0)

  postList.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())

  const feed = new Feed({
    ...baseOption,
    updated: new Date(updated),
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

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
