import getConfig from 'next/config'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { GetStaticProps, NextPage } from 'next/types'
import MarkdownRender from '@/components/markdown/Render'
import styles from '@/styles/index.module.scss'

interface PageProps {
  source: string
}

const Home: NextPage<PageProps> = (props) => {

  const { source } = props

  return (
    <div className={styles.index}>
      <MarkdownRender source={source} />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const { rootDir } = getConfig().serverRuntimeConfig

  const indexFilePath = resolve(rootDir, 'md/index.md')

  const source = await readFile(indexFilePath, 'utf-8')

  return {
    props: {
      source,
    },
  }
}

export default Home
