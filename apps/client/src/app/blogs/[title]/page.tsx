import React from 'react'
import to from 'await-to-js'
import matter from 'gray-matter'
import { notFound } from 'next/navigation'

import { request } from '@/utils/request'
import PostRender from '@/components/Post'

type Props = {
  params: { title: string }
}

export const generateMetadata = ({ params }: Props) => {
  const title = decodeURIComponent(params.title)
  return {
    title,
    keywords: [title],
  }
}

export const dynamicParams = true

interface ArticleItem {
  title: string
  post: number
}

export const generateStaticParams = async () => {

  const [error, data] = await to(
    request<ArticleItem[]>('/blog/list')
  )

  const list = (error || !data) ? [] : data

  return list.map((item) => ({ title: item.title }))
}

interface ArticleDto {
  title: string
  content: string
  post: number
  update: number
}

const getPost = async (params: PageProps['params']) => {

  const [error, data] = await to(
    request<ArticleDto>(`/blog/detail/${decodeURIComponent(params.title)}`)
  )

  if (error || !data) {
    notFound()
  }

  const { title, post, update } = data

  const { content } = matter(data.content)

  return {
    title,
    content,
    meta: {
      created: post,
      updated: update,
    },
  }
}

interface PageProps {
  params: {
    title: string
  }
}

const BlogDetail = async ({ params }: PageProps) => {

  const post = await getPost(params)

  const { title, content, meta } = post

  return (
    <div className='m-auto max-w-4xl animate-main'>
      <PostRender
        meta={meta}
        title={title}
        content={content}
      />
    </div>
  )
}

export default BlogDetail