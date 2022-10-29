import { Fn, Pausable, RafFnOptions } from '@/types'

export const useRafFn = (fn: Fn, options: RafFnOptions = {}): Pausable => {
  const {
    immediate = true,
  } = options

  const isActive = { current: false }

  const loop = () => {
    if (!isActive.current) {
      return
    }
    fn()
    window?.requestAnimationFrame(loop)
  }

  const resume = () => {
    if (!isActive.current) {
      isActive.current = true
      loop()
    }
  }

  const pause = () => {
    isActive.current = false
  }

  immediate && resume()

  // tryOnScopeDispose(pause)

  return {
    isActive,
    pause,
    resume,
  }
}

export default useRafFn