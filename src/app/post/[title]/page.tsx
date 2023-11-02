import React from 'react'
import { notFound } from 'next/navigation'

import '@/styles/post.scss'
import { compile } from '@/utils/mdx'
import License from '@/components/post/License'
import TableOfContent from '@/components/mdx/TOC'
import { getPostDetail, getPostList } from '@/server/post'

interface PageProps {
  params: {
    title: string
  }
}

export const generateMetadata = ({ params }: PageProps) => {
  const title = decodeURIComponent(params.title)
  return {
    title,
    keywords: [title],
  }
}

export const generateStaticParams = async () => {
  const list = await getPostList()

  return list.map((item) => ({ title: item.title }))
}

const PostPage = async ({ params }: PageProps) => {
  const post = await getPostDetail(decodeURIComponent(params.title))

  if (!post) {
    notFound()
  }

  const { title, content: source, meta } = post

  try {
    const { content } = await compile(source)

    const { created, updated } = meta

    return (
      <React.Fragment>
        <TableOfContent source={source} />
        <article id="post-content" className="animate-main">
          <h1 className="text-center text-4xl font-bold leading-loose">{title}</h1>
          <div>{content}</div>
        </article>
        <License created={created} updated={updated} />
      </React.Fragment>
    )
  } catch (error) {
    console.error(error)
    notFound()
  }
}

export default PostPage
