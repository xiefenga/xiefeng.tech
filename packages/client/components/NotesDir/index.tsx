import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Checkbox, CheckboxChecked } from 'styled-icons/boxicons-regular'

import { Article } from '@/types'
import ProseList from '../Prose/ProseList'
import CategoryList from '../Category/CategoryList'
import type { DirJson } from '@/utils/files'

interface NotesDirProps {
  articles?: Article[]
  dirs?: DirJson[]
}

const useCorrectEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const NotesDir: React.FC<NotesDirProps> = ({ dirs = [], articles = [] }) => {

  const [checked, setChecked] = useState(true)

  useCorrectEffect(() => {
    setChecked(localStorage.getItem('categoryChecked') === 'checked')
  }, [])

  const changeCheckStatus = () => {
    setChecked(!checked)
    localStorage.setItem('categoryChecked', !checked ? 'checked' : '')
  }

  if (dirs.length && articles.length) {
    return (
      <div className='max-w-3xl mx-auto'>
        <button
          onClick={changeCheckStatus}
          className='uppercase flex items-center mb-2.5 opacity-30'
        >
          <span className='w-7'>
            {checked ? <CheckboxChecked /> : <Checkbox />}
          </span>
          <span className='mt-1'>category</span>
        </button >
        {
          checked ? (
            <CategoryList dirs={dirs} />
          ) : (
            <div className='mt-10'>
              <ProseList articles={articles} />
            </div>
          )
        }
      </div >
    )
  }

  return (
    <div className='max-w-3xl mx-auto'>
      <CategoryList dirs={dirs} />
      <ProseList articles={articles} />
    </div >
  )
}

export default NotesDir