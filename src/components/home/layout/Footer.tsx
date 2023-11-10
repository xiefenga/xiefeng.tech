import dayjs from 'dayjs'
import Link from 'next/link'

import { env } from '@/env.mjs'
import IconLink from '@/components/home/icon/IconLink'

const Footer = () => {
  const currentYear = dayjs().get('year')

  const startYear = env.SITE_START_YEAR

  const copyrightYear = startYear === currentYear ? startYear : `${startYear} - ${currentYear}`

  return (
    <footer className="h-20 px-8 text-sm">
      <div className="flex items-center justify-between border-t border-gray-300 pt-6 opacity-70">
        <div>
          {/* ICP */}
          <Link target="_blank" className="link-border" href="https://beian.miit.gov.cn/">
            {env.BEIAN_ICP}
          </Link>
          {/* copyright */}
          <span className="ml-1 capitalize">
            {' '}
            © {copyrightYear} {env.SITE_AUTHOR}
          </span>
        </div>
        {/* POWERED BY */}
        <div className="flex items-center">
          <span className="shadow-text mr-2 uppercase">Powered by</span>
          <IconLink
            icon="logos:nextjs"
            iconClassName="w-16"
            className="dark:invert"
            href="https://nextjs.org"
          />
        </div>
      </div>
    </footer>
  )
}

export default Footer
