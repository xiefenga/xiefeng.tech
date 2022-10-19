import React from 'react'
import dayjs from 'dayjs'

import TOC from '../TOC'
import Markdown from '../Markdown'
import Back2Top from '../Back2Top'
import { cssModules } from '@/utils/styles'
import Back2Previous from '../Back2Previous'
import styles from '@/styles/article.module.css'

const {
  articleContent,
  articleContainer,
} = cssModules(styles)

interface ArticleDetailProps {
  title: string
  content: string
  meta: any
}

const ArticleDetail: React.FC<ArticleDetailProps> = props => {
  const { title, content, meta } = props
  return (
    <React.Fragment>
      <TOC source={content} />
      <Back2Top />
      <div className={articleContainer}>
        <div className='mb-8'>
          <h1 data-title className='mb-0'>{title}</h1>
          <p className='opacity-50 !-mt-2'>
            <span>Post: {dayjs(meta.birthTime).format('YYYY.MM.DD')}</span>
            <span className='font-bold'>·</span>
            <span>Update: {dayjs(meta.updateTime).format('YYYY.MM.DD')}</span>
          </p>
        </div>
        <Markdown className={articleContent} article={content} />
        <Back2Previous />
      </div>
    </React.Fragment>
  )
}

export default ArticleDetail