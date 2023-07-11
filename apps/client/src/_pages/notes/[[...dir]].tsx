import { useBoolean } from 'ahooks'
import { Icon } from '@iconify/react'

import { ParsedUrlQuery } from 'node:querystring'
import { GetStaticProps, NextPage } from 'next/types'


const NotesPage: NextPage = () => {

  const [isDir, actions] = useBoolean(true)

  const icon = isDir ? 'material-symbols:check-box-outline' : 'material-symbols:check-box-outline-blank'

  return (
    <div>
      <div className='flex items-center cursor-pointer uppercase opacity-30 text-lg select-none' onClick={actions.toggle}>
        <Icon className='text-xl' icon={icon} />
        <span className='ml-1'>directory</span>
      </div>
      <div></div>
    </div>
  )
}

interface Params extends ParsedUrlQuery {
  dir?: string[]
}

export const getStaticProps: GetStaticProps<{}, Params> = async (context) => {
  
  const { params = {} } = context

  const { dir = [] } = params

  const path = dir.join('/')

  console.log(path)

  return {
    props: {},
  }
}

export const getStaticPaths = async () => {

  return {
    paths: [],
    fallback: false,
  }
}

export default NotesPage
