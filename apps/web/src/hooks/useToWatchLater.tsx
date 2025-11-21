'use client'

import { RefObject } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createRoot, Root } from 'react-dom/client'

interface ParabolaOptions {
  targetId?: string
  duration?: number
  curvature?: number
}

export const useToWatchLater = (
  ref: RefObject<HTMLElement | null>,
  {
    targetId = 'favorite-watch-later-target',
    duration = 1.3,
    curvature = 0.05,
  }: ParabolaOptions = {}
) => {
  const trigger = () => {
    const startEl = ref.current
    const targetEl = document.getElementById(targetId)
    if (!startEl || !targetEl) return

    const startRect = startEl.getBoundingClientRect()
    const targetRect = targetEl.getBoundingClientRect()

    const startX = startRect.left + startRect.width / 2
    const startY = startRect.top + startRect.height / 2
    const endX = targetRect.right
    const endY = targetRect.bottom

    const controlX = (startX + endX) / 2
    const controlY = Math.min(startY, endY) - Math.abs(endX - startX) * curvature

    const container = document.createElement('div')
    document.body.appendChild(container)
    const root: Root = createRoot(container)

    const Dot = () => (
      <AnimatePresence>
        <motion.div
          className='size-2 bg-red-500 rounded-full fixed top-0 left-0 z-9999999999999 pointer-events-none'
          initial={{ x: startX, y: startY }}
          animate={{
            x: [startX, controlX, endX],
            y: [startY, controlY, endY],
            scale: [1, 1.3, 0.5],
          }}
          transition={{ duration, ease: 'easeInOut' }}
          onAnimationComplete={() => {
            root.unmount()
            container.remove()
          }}
        />
      </AnimatePresence>
    )

    root.render(<Dot />)
  }

  return { trigger }
}
