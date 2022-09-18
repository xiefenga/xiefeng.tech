import Link from 'next/link'
import type { NextPage } from 'next'
import DocTitle from '@/components/Meta/DocTitle'

const Home: NextPage = () => {

  return (
    <div className='flex justify-evenly items-center h-60'>
      <DocTitle title='/' />
      <span>
        <a href='/blogs'>
          blogs
        </a>
      </span>
      <span>
        <Link href='/notes'>
          notes
        </Link>
      </span>
      <span>
        <a href="https://github.com/xiefenga" target='_blank' rel="noreferrer" >
          github
        </a>
      </span>
    </div>
  )
}

export default Home

