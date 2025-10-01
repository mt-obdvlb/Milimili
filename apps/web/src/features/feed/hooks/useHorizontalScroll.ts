'use client'
import { RefObject, useCallback, useEffect, useState } from 'react'

export const useHorizontalScroll = (
  containerRef: RefObject<HTMLDivElement | null>,
  itemCount: number,
  itemWidth: number,
  onIndexChange?: (newTranslateX: number) => void
) => {
  const [translateX, setTranslateX] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateButtonStatus = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const maxTranslate = container.clientWidth - itemCount * itemWidth
    setCanScrollLeft(translateX < 0)
    setCanScrollRight(translateX > maxTranslate)
  }, [containerRef, itemCount, itemWidth, translateX])

  const moveLeft = () => {
    const container = containerRef.current
    if (!container) return
    const step = container.clientWidth / 2
    const newTranslate = Math.min(translateX + step, 0)
    setTranslateX(newTranslate)
    onIndexChange?.(newTranslate)
  }

  const moveRight = () => {
    const container = containerRef.current
    if (!container) return
    const step = container.clientWidth / 2
    const maxTranslate = container.clientWidth - itemCount * itemWidth
    const newTranslate = Math.max(translateX - step, maxTranslate)
    setTranslateX(newTranslate)
    onIndexChange?.(newTranslate)
  }

  useEffect(() => {
    updateButtonStatus()
  }, [updateButtonStatus])

  useEffect(() => {
    const handleResize = () => updateButtonStatus()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateButtonStatus])

  return { translateX, canScrollLeft, canScrollRight, moveLeft, moveRight, setTranslateX }
}
