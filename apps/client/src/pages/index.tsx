import { to } from 'await-to-js'
import { GetStaticProps, NextPage } from 'next/types'

import { request } from '@/api/request'
import styles from '@/styles/index.module.scss'
import MarkdownRender from '@/components/markdown/Render'

interface PageProps {
  source: string
}

const HomePage: NextPage<PageProps> = (props) => {

  const { source } = props

  return (
    <div className={styles.index}>
      <MarkdownRender source={source} />
    </div>
  )
}

interface RequestData {
  type: string
  content: string
}

export const getStaticProps: GetStaticProps = async () => {

  const [error, data] = await to(request<RequestData>('/meta/detail/about'))

  const source = (error || !data) ? '暂无内容' : data.content

  return {
    props: {
      source,
    },
  }
}

export default HomePage
