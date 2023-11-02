import Link from 'next/link'

import { env } from '@/env.mjs'
import IconLink from '../icon/IconLink'
import ThemeToggle from '../ThemeToggle'

const Header = () => {
  return (
    <header className="flex h-16 animate-header items-center px-20">
      <h1 className="font-virgil">
        <Link draggable={false} className="select-none text-xl uppercase" href="/">
          {env.SITE_AUTHOR}
        </Link>
      </h1>
      <div className="ml-auto flex items-center gap-6">
        <Link className="nav-link" href="/post">
          Blogs
        </Link>
        <Link className="nav-link" href="/weekly">
          Weekly
        </Link>
        <Link className="nav-link" href="/projects">
          Projects
        </Link>
        <div className="flex select-none items-center gap-6 text-2xl text-icon">
          <IconLink href="/feed.xml" icon="heroicons:rss-solid" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export default Header
