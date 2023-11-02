import clsx from 'clsx'
import { cache } from 'react'

import { prisma } from '@/server/db'
import { compile } from '@/utils/mdx'
import TechStack from '@/components/TechStack'
import SocialLinks from '@/components/SocialLinks'

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

  // const content = [
  //   `I'm 0x1461A0`,
  //   `A Web <Developer /> living in Nanjing`,
  //   `Love computers and programming, Strive to become a lifelong learner`,
  //   // 这是我的个人博客，记录一些学习和生活的东西
  // ]

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
