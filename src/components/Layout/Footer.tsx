import React from 'react'
import Link from 'next/link'
import getConfig from 'next/config'
import { Icon } from '@iconify/react'

const Footer: React.FC = () => {

  const { publicRuntimeConfig } = getConfig()

  const { beian, nextjs } = publicRuntimeConfig

  const currentYear = new Date().getFullYear()

  return (
    // font-medium
    <footer className='mt-32 '>
      <div className='flex items-center justify-end mb-2'>
        <span className='mr-2 uppercase'>Powered by</span>
        <Link target='_blank' href={nextjs}>
          <Icon icon='logos:nextjs' />
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
          {beian}
        </Link>
      </div>
    </footer>
  )
}


export default Footer