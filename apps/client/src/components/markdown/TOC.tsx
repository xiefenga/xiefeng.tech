import React from 'react'
import Link from 'next/link'
import { unified } from 'unified'
import { useEffect } from 'react'
import remarkParse from 'remark-parse'
import type { Heading, Text } from 'mdast'

interface NavData {
  id: string
  text: string
  depth: number
  children: NavData[]
}

const handleNestingNav = (navs: NavData[], nav: NavData) => {
  if (navs.length === 0 || nav.depth === navs[navs.length - 1].depth) {
    navs.push(nav)
  } else {
    handleNestingNav(navs[navs.length - 1].children, nav)
  }
}

// level 1 for previous article
const levels = [1, 2, 3, 4, 5, 6]

type Level = 1 | 2 | 3 | 4 | 5 | 6

const scrollTo = (selector: string) => {
  document.querySelector(selector)
    ?.scrollIntoView({ behavior: 'smooth' })
}

const navigate = (uuid?: string) => {
  if (uuid) {
    const selector = `[data-uuid="${uuid}"]`
    scrollTo(selector)
  } else if (location.hash) {
    // 用于解决 hash 中带空格的情况，例如：#Reactivity API
    const hash = decodeURIComponent(location.hash).slice(1)
    const selector = `[data-id="${hash}"]`
    scrollTo(selector)
  }
}

interface TOCProps {
  source: string
}

const TOC: React.FC<TOCProps> = ({ source }) => {

  useEffect(() => {
    // add id for headings (add anchor)
    levels.forEach(level => {
      const headings = document.querySelectorAll<HTMLHeadingElement>(`h${level}:not([data-title])`)
      Array.from(headings).forEach((head, order) => {
        const text = head.innerText
        head.id = head.dataset.id = text
        head.dataset.uuid = `h${level}-${text}-${order}`
      })
    })

    // init scroll
    setTimeout(() => navigate(), 500)
  }, [])

  // 生成 toc
  const processor = unified().use(remarkParse)

  const tree = processor.parse(source)

  const headingCoutMap = new Map<Level, number>()

  const toc = tree.children
    .filter((node): node is Heading => node.type === 'heading')
    .reduce<NavData[]>((navs, node) => {
      const { depth, children } = node

      // 忽略不正常的写法，# 后面只给写文本
      const text = children.filter((item): item is Text => item.type === 'text').map(item => item.value).join('')

      // 生成每个目录唯一 id
      const count = headingCoutMap.get(depth) ?? 0
      const id = `h${depth}-${text}-${count}`
      headingCoutMap.set(depth, count + 1)

      // 生成目录结构
      const nav = { id, text, depth, children: [] }
      handleNestingNav(navs, nav)
      return navs
    }, [])

  // 每个锚点单独给id的原因
  // 处理 edge case: 对于同名标题点击仅跳转第一个的问题
  const onAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const hash = (e.target as HTMLAnchorElement).href
    window.history.replaceState({}, '', hash)
    const uuid = (e.target as HTMLAnchorElement).dataset.targetId
    navigate(uuid)
  }

  const renderTOC = (toc: NavData[]) => {
    return toc.map(nav => (
      <React.Fragment key={nav.id}>
        <li>
          <Link href={`#${nav.text}`} data-target-id={nav.id} onClick={onAnchorClick}>
            {nav.text}
          </Link>
        </li>
        <ul>{renderTOC(nav.children)}</ul>
      </React.Fragment>
    ))
  }

  return (
    <ul className='toc-container hidden xl:block'>
      {renderTOC(toc)}
    </ul>
  )
}

export default TOC