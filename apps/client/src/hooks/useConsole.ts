import { useMount } from 'ahooks'

import { isProd } from '@/utils/env'
import { SITE_NAME_ASCII } from '@/utils/constant'

export const useConsole = isProd ? (
  () => {
    useMount(() => {
      console.log(`%c${SITE_NAME_ASCII}`, 'font-family: Monospace;')
    })
  }
) : () => { }