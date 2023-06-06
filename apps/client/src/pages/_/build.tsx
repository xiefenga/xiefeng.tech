import dayjs from 'dayjs'
import PKG from '../../../package.json'
import { NextPage, GetStaticProps } from 'next/types'

interface PageProps {
  meta: {
    version: string
    buildingTime: number
  }
}

const BuildPage: NextPage<PageProps> = (props) => {

  const { meta } = props

  return (
    <div className='flex flex-col h-full'>
      <div className='grow'></div>
      <div className='leading-loose'>
        <p>
          <span>版本: </span>
          <span>{meta.version}</span>
        </p>
        <p>
          <span>构建时间: </span>
          <span>{dayjs(meta.buildingTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        </p>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  return {
    props: {
      meta: {
        version: PKG.version,
        buildingTime: Date.now(),
      },
    },
  }
}

export default BuildPage