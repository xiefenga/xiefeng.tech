import React from 'react'
import dayjs from 'dayjs'

import '@/styles/post.scss'
import Back2Top from '../Back2Top'
import TOC from '@/components/markdown/TOC'
import MarkdownRender from '@/components/markdown/Render'

interface ArticleProps {
  title: string
  content: string
  meta: {
    created: number
    updated: number
  }
}


const PostRender: React.FC<ArticleProps> = (props) => {

  const { title, content, meta } = props

  const { created, updated } = meta

  const postDate = dayjs(created).format('YYYY-MM-DD')

  const updateDate = dayjs(updated).format('YYYY-MM-DD')

  const renderMeta = () => {
    const metaList = [postDate]
    if (postDate !== updateDate) {
      metaList.push(updateDate)
    }
    return metaList.map((meta, index) => (
      <React.Fragment key={index}>
        <span>{meta}</span>
        {index !== metaList.length - 1 && (
          <span className='mx-2'>·</span>
        )}
      </React.Fragment>
    ))
  }

  return (
    <React.Fragment>
      <article className='post'>
        <h1 data-title={title} className='text-[2.75rem] font-bold mb-4'>
          {title}
        </h1>
        <div className='flex mb-10 pb-4 pt-2 border-b border-gray-300'>
          {renderMeta()}
        </div>
        <MarkdownRender source={content} />
      </article>
      <Back2Top />
      <TOC source={content} />
    </React.Fragment>
  )
}

export default PostRender