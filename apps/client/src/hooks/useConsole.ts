import { useEffect } from 'react'
import { isProd } from '@/utils/env'
import { SITE_NAME_ASCII } from '@/utils/constant'

export const useConsole = () => {

  useEffect(() => {
    if (isProd) {
      // const text = [`%c${SITE_ASCII}`, `%cpowered by ${SITE_ASCII_SOURCE}`].join('\n')
      // console.log(text, 'font-size: 16px; font-family: Monospace;', 'font-size: 14px; line-height: 2;')
      console.log(`%c${SITE_NAME_ASCII}`, 'font-family: Monospace;')
    }
  }, [])

}