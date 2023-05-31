import React from 'react'
import dayjs from 'dayjs'

import Meta from './Meta'
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


const Article: React.FC<ArticleProps> = (props) => {

  const { title, content, meta } = props

  const { created, updated } = meta

  const postDate = dayjs(created).format('YYYY-MM-DD')

  const updateDate = dayjs(updated).format('YYYY-MM-DD')

  return (
    <article>
      <h1 data-title={title} className='text-[2.75rem] font-bold mb-8'>{title}</h1>
      <div className='flex mb-10 pb-4 pt-2 border-b border-gray-300'>
        <Meta
          text='发布于'
          value={postDate}
          icon='iconamoon:calendar-2'
        />
        {postDate !== updateDate && (
          <React.Fragment>
            <p className='px-2'>·</p>
            <Meta
              text='更新于'
              value={updateDate}
              iconClassName='text-base'
              icon='iconamoon:synchronize-bold'
            />
          </React.Fragment>
        )}
        {/* <p className='px-2'>·</p>
        <Meta
          text='字数总计'
          value='5000'
          icon='iconamoon:file-document'
        /> */}
      </div>
      <Back2Top />
      <TOC source={content} />
      <MarkdownRender source={content} />
    </article>
  )
}

export default Article