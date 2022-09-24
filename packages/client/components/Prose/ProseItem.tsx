import React from 'react'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface ProseItemProp {
  title: string
  meta: any
}

const ProseItem: React.FC<ProseItemProp> = (props) => {
  const { title, meta: { birthTime, updateTime } } = props
  // const current = Date.now()
  // const offset = current - updateTime
  // const days = offset / (24 * 60 * 60 * 1000)
  // const months = days / 30
  // const years = days / 365
  // const renderTime = () => {
  //   return years >= 1
  //     ? [Math.floor(years), 'years']
  //     : months >= 1
  //       ? [Math.floor(months), 'months']
  //       : [Math.floor(days), 'days']
  // }

  const router = useRouter()

  return (
    <div className='flex flex-col items-start p-[0.5em]'>
      <div className='text-lg leading-1.2em m-b-2'>
        <Link href={`${router.asPath}/${title}`}>
          <a >{title}</a>
        </Link>
      </div>
      <div className='text-sm opacity-50 border-t border-[#ddd] pt-1'>
        <span>Post: {dayjs(birthTime).format('YYYY.MM.DD')}</span>
        <span className='font-bold'>·</span>
        <span>Update: {dayjs(updateTime).format('YYYY.MM.DD')}</span>
      </div>
    </div>
  )
}

export default ProseItem