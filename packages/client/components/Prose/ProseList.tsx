import React from 'react'
import type { Article } from '@/types'
import ProseItem from './ProseItem'

interface ProseListProp {
  articles: Article[]
}

const ProseList: React.FC<ProseListProp> = ({ articles }) => {
  return articles.length
    ? (
      <ul>
        {articles.map(article => (
          <li
            key={JSON.stringify(article)}
            className='mt-2 mb-6 opacity-60 hover:opacity-100 transition-opacity duration-200 ease-in-out'
          >
            <ProseItem
              title={article.title}
              meta={article.meta}
            />
          </li>
        ))}
      </ul>
    ) : null
}

export default ProseList