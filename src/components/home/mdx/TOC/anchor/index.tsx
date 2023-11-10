'use client'
import clsx from 'clsx'
import React from 'react'
import Link from 'next/link'
import { useEventListener, useMount } from 'ahooks'

import styles from './index.module.scss'
import { TOCItem, AnchorLink } from '../interface'

const levels = [1, 2, 3, 4, 5, 6]

const getOffsetTopOfDoc = (element: HTMLElement) => {
  return element.getBoundingClientRect().top - element.ownerDocument!.documentElement!.clientTop
}

const scrollTo = (target: number, duration = 450) => {
  const current = window.scrollY
  const offset = target - current
  // TODO: improve the animation
  const step = offset / (duration / 16)
  let next = current
  return new Promise<void>((resolve) => {
    const scrollFn = () => {
      next = next + step
      next = offset > 0 ? (next > target ? target : next) : next < target ? target : next
      window.scrollTo(
        window.scrollX,
        offset > 0 ? (next > target ? target : next) : next < target ? target : next,
      )
      if (next === target) {
        resolve()
        return
      }
      requestAnimationFrame(scrollFn)
    }
    requestAnimationFrame(scrollFn)
  })
}

interface AnchorProps {
  toc: TOCItem[]
  links: AnchorLink[]
  offsetTop: number
  delay: number
}

interface AnchorRecord {
  link: AnchorLink
  offset: number
}

const Anchor: React.FC<AnchorProps> = ({ toc, links, delay, offsetTop }) => {
  // record current scroll status
  const scrollingRef = React.useRef<boolean>(false)

  const [activeLink, setActiveLink] = React.useState<AnchorLink>()

  const getCurrentAnchor = () => {
    const allViewsAnchors: AnchorRecord[] = []

    links.forEach((link) => {
      const target = document.querySelector<HTMLElement>(`[data-uuid='${link.id}']`)
      if (target) {
        const offset = getOffsetTopOfDoc(target)
        if (offset < offsetTop) {
          allViewsAnchors.push({ link, offset })
        }
      }
    })
    // find last anchor
    if (allViewsAnchors.length) {
      return allViewsAnchors.reduce((max, item) => (item.offset > max.offset ? item : max)).link
    }
  }

  const handleScroll = () => {
    if (!scrollingRef.current) {
      const current = getCurrentAnchor()
      setActiveLink(current)
    }
  }

  // add scroll listener
  useEventListener('scroll', handleScroll, { target: () => document })

  const scrollToAnchor = async (selector: string) => {
    scrollingRef.current = true
    const target = document.querySelector<HTMLElement>(selector)
    if (!target) {
      return
    }
    const offset = getOffsetTopOfDoc(target)
    await scrollTo(offset + window.scrollY)
    scrollingRef.current = false
  }

  // add id for headings
  useMount(() => {
    levels.forEach((level) => {
      const headings = document.querySelectorAll<HTMLHeadingElement>(`h${level}:not([data-title])`)
      Array.from(headings).forEach((head, order) => {
        const text = head.innerText
        head.id = head.dataset.id = text
        head.dataset.uuid = `${level}-${order}`
      })
    })
  })

  // init scroll
  useMount(() => {
    setTimeout(() => {
      // decodeURIComponent handle when hash has space, for example: #Reactivity API
      const hash = decodeURIComponent(location.hash).slice(1)
      if (hash) {
        const target = links.find((link) => link.text === hash)
        setActiveLink(target)
        const selector = `[data-id="${hash}"]`
        scrollToAnchor(selector)
      }
    }, delay)
  })

  const renderTOC = (toc: TOCItem[]) => {
    if (toc.length) {
      return toc.map((nav) => {
        const onAnchorClick = async () => {
          setActiveLink(nav)
          scrollToAnchor(`[data-uuid='${nav.id}']`)
        }
        return (
          <React.Fragment key={nav.id}>
            <li className="truncate leading-relaxed">
              <Link
                href={`#${nav.text}`}
                data-target-id={nav.id}
                onClick={onAnchorClick}
                className={clsx(
                  'opacity-60 transition-all duration-300',
                  activeLink?.id === nav.id
                    ? 'font-bold text-neutral-950 dark:text-neutral-50'
                    : 'text-neutral-400 hover:text-neutral-800 dark:text-neutral-600 dark:hover:text-neutral-100',
                )}
              >
                {nav.text}
              </Link>
            </li>
            <ul>{renderTOC(nav.children)}</ul>
          </React.Fragment>
        )
      })
    }
  }

  return <ul className={styles.anchor}>{renderTOC(toc)}</ul>
}

export default Anchor
