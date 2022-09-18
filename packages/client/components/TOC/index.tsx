import React, { useEffect } from 'react'
import module from './index.module.css'
import { cssModules } from '@/utils/styles'
import { getNavStructure, SubNavData } from '@/utils/toc'

const { tableOfContent } = cssModules(module)

interface TOCProp {
  source: string
  className?: string
}

const TOC: React.FC<TOCProp> = (prop) => {
  const { source } = prop
  const navData = getNavStructure(source)

  // 所有的 h 元素加上 id
  useEffect(() => {
    const levels = [1, 2, 3, 4, 5, 6]
    levels.forEach(level => {
      Array
        .from(document.querySelectorAll<HTMLHeadingElement>(`h${level}:not([data-title])`))
        .forEach((h, order) => {
          h.id = h.dataset.id = h.innerText
          h.dataset.uuid = `h${level}-${h.innerText}-${order}`
        })
    })
  }, [])

  // 初始跳转
  useEffect(() => {
    setTimeout(navigate, 500)
  }, [])

  // todo 页面滚动 hash 跟着变

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

  const scrollTo = (selector: string) => {
    document.querySelector(selector)
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleAnchors = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    // @ts-ignore
    const hash = e.target.href
    window.history.replaceState({}, '', hash)
    // @ts-ignore && bugFix 对于同名标题点击仅跳转第一个
    const uuid = e.target.dataset.targetId
    navigate(uuid)
  }

  const renderTOC = (navs: SubNavData[] = []) => {
    return navs.length
      ? (
        <ul>
          {navs.map(nav => (
            <li key={`${nav.level}-${nav.text}-${Math.random()}`}>
              <a href={`#${nav.text}`} data-target-id={nav.id} onClick={handleAnchors}>
                {nav.text}
              </a>
              {renderTOC(nav.subs)}
            </li>
          ))}
        </ul>
      ) : null
  }

  return (
    <div className={tableOfContent}>
      {renderTOC(navData)}
    </div>
  )
}

export default TOC