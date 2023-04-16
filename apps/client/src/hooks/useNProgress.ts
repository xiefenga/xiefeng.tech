import { useEffect } from 'react'
import { useRouter } from 'next/router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export const useNProgress = () => {
  const router = useRouter()

  useEffect(() => {
    const start = () => NProgress.start()
    const done = () => NProgress.done()

    router.events.on('routeChangeStart', start)
    router.events.on('routeChangeComplete', done)
    router.events.on('routeChangeError', done)

    return () => {
      router.events.off('routeChangeStart', start)
      router.events.off('routeChangeComplete', done)
      router.events.off('routeChangeError', done)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export default useNProgress
