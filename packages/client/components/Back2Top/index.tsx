import debounce from 'lodash.debounce'
import { UpArrow } from 'styled-icons/boxicons-regular'
import React, { useCallback, useEffect, useRef, useState } from 'react'


type ScrollStatus = {
  scrolling: boolean
}

const INIT_SCROLL_STATUS = {
  scrolling: false,
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

  const scrollStatus = useRef<ScrollStatus>({ ...INIT_SCROLL_STATUS })

  useEffect(() => {
    document.addEventListener('scroll', scrollHandle)
    return () => {
      document.removeEventListener('scroll', scrollHandle)
    }
  }, [])

  const scrollHandle = useCallback(debounce(() => {
    const scrollOffset = document.documentElement.scrollTop
    setShowStatus(scrollOffset > 1000)
  }, 100), [])


  const scroll2Top = async () => {
    scrollStatus.current.scrolling = true
    await smoothScroll({ top: 0 })
    scrollStatus.current.scrolling = false
  }

  return showStatus
    ? (
      <div className='fixed right-5 bottom-10 to-top'>
        <button className='px-2 w-9' onClick={scroll2Top}>
          <UpArrow />
        </button>
      </div>
    ) : null

}

export default Back2Top