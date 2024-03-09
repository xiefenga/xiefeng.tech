import clsx from 'clsx'
import { cache } from 'react'

import { prisma } from '@/server/db'
import { compile } from '@/utils/mdx'
import TechStack from '@/components/home/TechStack'
import SocialLinks from '@/components/home/SocialLinks'

const getAbout = cache(async () => {
  const about = await prisma.meta.findFirst({
    where: {
      type: 'about',
    },
    select: {
      value: true,
    },
  })

  return about?.value ?? '暂无内容'
})

interface IndexFrontMatter {
  title?: string
  techStack?: string[]
  [key: string]: unknown
}

const Home = async () => {
  const source = await getAbout()

  const { content, frontmatter } = await compile<IndexFrontMatter>(source)

  const { title = 'Hello', techStack = [] } = frontmatter

  return (
    <div className="mx-auto max-w-5xl animate-main">
      <h2 className={clsx('text-5xl font-bold leading-loose')}>{title}</h2>
      <div className="my-8 flex flex-col items-start gap-2 font-mono text-2xl leading-loose">
        {content}
      </div>
      <TechStack skills={techStack.map((tech) => tech.toLowerCase())} />
      <SocialLinks />
    </div>
  )
}

export default Home
