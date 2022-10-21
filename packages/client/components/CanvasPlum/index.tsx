import classnames from 'classnames'
import { useWindowSize } from 'react-use'
import React, { useEffect, useMemo, useRef } from 'react'

import { Fn } from '@/types'
import useRafFn from '@/hooks/useRafFn'
import { initCanvas, polar2cart } from '@/utils/canvas'
import styles from './index.module.css'

const CanvasPlum: React.FC = () => {

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const r180 = Math.PI
  const r90 = Math.PI / 2
  const r15 = Math.PI / 12
  const color = '#88888825'

  const { random } = Math
  const size = useWindowSize()

  const init = 4
  const len = 6
  const stopped = useRef(false)

  const draw = () => {
    const canvas = canvasRef.current!
    const { ctx } = initCanvas(canvas, size.width, size.height)
    const { width, height } = canvas
    let steps: Fn[] = []
    let prevSteps: Fn[] = []
    let iterations = 0
    const step = (x: number, y: number, rad: number) => {
      const length = random() * len
      const [nx, ny] = polar2cart(x, y, length, rad)
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(nx, ny)
      ctx.stroke()
      const rad1 = rad + random() * r15
      const rad2 = rad - random() * r15
      if (nx < -100 || nx > size.width + 100 || ny < -100 || ny > size.height + 100) {
        return
      }
      if (iterations <= init || random() > 0.5) {
        steps.push(() => step(nx, ny, rad1))
      }
      if (iterations <= init || random() > 0.5) {
        steps.push(() => step(nx, ny, rad2))
      }
    }

    let lastTime = performance.now()
    const interval = 1000 / 40
    let controls: ReturnType<typeof useRafFn>
    const frame = () => {
      if (performance.now() - lastTime < interval) {
        return
      }
      iterations += 1
      prevSteps = steps
      steps = []
      lastTime = performance.now()
      if (!prevSteps.length) {
        controls.pause()
        stopped.current = true
      }
      prevSteps.forEach(i => i())
    }

    controls = useRafFn(frame, { immediate: false })

    const start = () => {
      controls.pause()
      iterations = 0
      ctx.clearRect(0, 0, width, height)
      ctx.lineWidth = 1
      ctx.strokeStyle = color
      prevSteps = []
      steps = [
        () => step(random() * size.width, 0, r90),
        () => step(random() * size.width, size.height, -r90),
        () => step(0, random() * size.height, 0),
        () => step(size.width, random() * size.height, r180),
      ]
      if (size.width < 500) {
        steps = steps.slice(0, 2)
      }
      controls.resume()
      stopped.current = false
    }
    start()
    return () => {
      ctx.clearRect(0, 0, width, height)
      controls.pause()
    }
  }

  useEffect(draw, [size])

  const className = useMemo(() => {
    return classnames(
      styles.wrapper,
      'fixed inset-0',
      'pointer-events-none z-[-1]'
    )
  }, [])


  return (
    <div className={className}>
      <canvas ref={canvasRef} width="400" height="400" />
    </div>
  )
}

export default CanvasPlum