import clsx from 'clsx'
import React from 'react'
import { Icon } from '@iconify/react'
import debounce from 'lodash.debounce'
import { useRef, useState } from 'react'
import { useBoolean, useEventListener } from 'ahooks'

type ScrollStatus = {
  scrolling: boolean
}

type ScrollOption = {
  top?: number
  left?: number
}

const isEql = (current: number, target?: number) => {
  return target == null || current === target
}

function smoothScroll(
  option: ScrollOption,
  element: HTMLElement | Window = window
): Promise<void> {
  return new Promise(resolve => {
    const detectScrollEnd = debounce(() => {
      const [left, top] = element === window
        ? [element.scrollX, element.scrollY]
        : [
          (element as HTMLElement).scrollLeft,
          (element as HTMLElement).scrollTop,
        ]

      if (isEql(left, option.left) && isEql(top, option.top)) {
        element.removeEventListener('scroll', detectScrollEnd)
        resolve()
      }
    }, 100)

    element.addEventListener('scroll', detectScrollEnd)

    element.scrollTo({
      ...option,
      behavior: 'smooth',
    })
  })
}

const Back2Top: React.FC = () => {

  const [showStatus, setShowStatus] = useState(false)

  const scrollStatus = useRef<ScrollStatus>({ scrolling: false })

  const [footerClose, { set: setFooterClose }] = useBoolean(false)

  const handleScroll = debounce(() => {
    const scrollOffset = document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    setShowStatus(scrollOffset > 1000)
    const footerHeight = 110
    setFooterClose(scrollHeight - (scrollOffset + window.innerHeight) < footerHeight)
  }, 100)

  useEventListener('scroll', handleScroll, { target: () => document, passive: true })

  const scroll2Top = async () => {
    if (!scrollStatus.current.scrolling) {
      scrollStatus.current.scrolling = true
      await smoothScroll({ top: 0 })
      scrollStatus.current.scrolling = false
    }
  }

  const toTopClass = clsx('fixed right-10 bottom-10 transition-transform duration-300	to-top', { '-translate-y-24': footerClose} )

  return showStatus
    ? (
      <div className={toTopClass}>
        <button className='px-2 w-9' onClick={scroll2Top}>
          <Icon className='text-2xl opacity-60 transition-opacity hover:opacity-100' icon='material-symbols:arrow-upward' />
        </button>
      </div>
    ) : null

}

export default Back2Top