import React from 'react'

import DirView from './DirPanel'
import { DirJson } from '@/utils/files'

interface CategoryListProp {
  dirs: DirJson[]
}

const CategoryList: React.FC<CategoryListProp> = (props) => {
  const { dirs } = props
  console.log(dirs)
  return (
    <div className='flex flex-wrap'>
      {dirs.map(dir => (
        <DirView
          key={dir.path}
          path={dir.path}
          dirname={dir.dirname}
        />
      ))}
    </div>
  )
}

export default CategoryList

