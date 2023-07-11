import React from 'react'
import Link from 'next/link'
import NextLogo from '@/icons/NextLogo.svg'

const Footer: React.FC = () => {

  const currentYear = new Date().getFullYear()

  return (
    <footer className='mt-32'>
      <div className='flex items-center justify-end mb-2'>
        <span className='mr-2 uppercase'>Powered by</span>
        <Link className='dark:invert' target='_blank' href={process.env.NEXT_PUBLIC_NEXT_URL!}>
          <NextLogo />
        </Link>
      </div>
      <div className='flex justify-between pb-8 border-t border-gray-300 pt-4 opacity-70'>
        <div>
          <Link 
            target='_blank' 
            className='border-link'
            href='https://creativecommons.org/licenses/by-nc-sa/4.0/'
          >
            CC BY-NC-SA 4.0
          </Link>
          <span className='capitalize'> © {currentYear} xie feng</span>
        </div>
        <Link 
          target='_blank' 
          className='border-link'
          href='https://beian.miit.gov.cn/'
        >
          {process.env.NEXT_PUBLIC_BEIAN_ICP}
        </Link>
      </div>
    </footer>
  )
}


export default Footer