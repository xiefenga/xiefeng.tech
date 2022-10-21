import type { NextPage } from 'next'
import DocTitle from '@/components/Meta/DocTitle'

const Home: NextPage = () => {

  return (
    <div className='flex justify-evenly items-center h-60'>
      <DocTitle title='/' />
    </div>
  )
}

export default Home

