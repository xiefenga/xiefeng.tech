import React from 'react'
import matter from 'gray-matter'
import { NextPage, GetStaticProps, GetStaticPaths } from 'next/types'

import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

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

  const filename = resolve(process.env.OLD_BLOG_PATH as string, `${ctx.params.title}.md`)

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
  // const list = await readdir(process.env.BLOG_PATH as string)
  // console.log(list)
  // list.map(async (item) => {
  //   stat()
  // })

  // console.log(list)
  // const list = [
  //   'AVL树',
  //   'CDN和DNS',
  //   'HTTP2特性',
  //   'HTTP缓存',
  //   'JWT',
  //   'JavaScript手写',
  //   'JavaScript的继承',
  //   'NodeJS中的流',
  //   'NodeJS事件循环',
  //   'NodeJS多进程',
  //   'Promise A+规范',
  //   'Promise总结',
  //   'React HOOK总结',
  //   'React中的ref',
  //   'React中的上下文',
  //   'React中的事件',
  //   'React渲染原理',
  //   'React组件的生命周期',
  //   'TLS总结',
  //   'TS中的类型',
  //   'Vue2响应式数据处理',
  //   'Vue2的响应式原理',
  //   'Vue3中v-model的变化',
  //   'Vue中的样式穿透',
  //   'Web Worker',
  //   'Web文件处理',
  //   'cookie和session',
  //   'flex-item的尺寸',
  //   'hexo搭建',
  //   'http包体传输',
  //   'mongodb总结',
  //   'react-router核心原理',
  //   'redux原理',
  //   'requestAnimationFrame',
  //   'setState总结',
  //   'webpack中的性能优化',
  //   'webpack打包过程',
  //   'webpack模块化原理',
  //   '二叉堆',
  //   '二叉树和二叉搜索树',
  //   '关于像素',
  //   '同构渲染思路',
  //   '多路复用和分解',
  //   '布局总结',
  //   '弄明白BFC',
  //   '执行上下文',
  //   '排序算法总结',
  //   '数字的表示',
  //   '浏览器渲染原理',
  //   '浏览器页面循环',
  //   '跨域问题',
  //   '迭代器和生成器',
  // ]
  return { paths: [], fallback: 'blocking' }
}

export default BlogDetailPage