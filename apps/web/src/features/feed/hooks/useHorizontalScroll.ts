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

  const clampTranslate = (x: number) => {
    const container = containerRef.current
    if (!container) return 0
    const maxTranslate = container.clientWidth - itemCount * itemWidth
    return Math.min(0, Math.max(x, maxTranslate))
  }

  /** 更新左右按钮状态 */
  const updateButtonStatus = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const contentWidth = itemCount * itemWidth
    const containerWidth = container.clientWidth

    if (contentWidth <= containerWidth) {
      setCanScrollLeft(false)
      setCanScrollRight(false)
      return
    }

    const maxTranslate = containerWidth - contentWidth
    setCanScrollLeft(translateX < 0)
    setCanScrollRight(translateX > maxTranslate)
  }, [containerRef, itemCount, itemWidth, translateX])

  /** 左移 */
  const moveLeft = () => {
    const container = containerRef.current
    if (!container) return
    const step = container.clientWidth / 2
    const newTranslate = clampTranslate(translateX + step)
    setTranslateX(newTranslate)
    onIndexChange?.(newTranslate)
  }

  /** 右移 */
  const moveRight = () => {
    const container = containerRef.current
    if (!container) return
    const step = container.clientWidth / 2
    const newTranslate = clampTranslate(translateX - step)
    setTranslateX(newTranslate)
    onIndexChange?.(newTranslate)
  }

  /** 新增：滚动到指定 index */
  const scrollToIndex = (index: number) => {
    const container = containerRef.current
    if (!container) return

    const itemLeft = index * itemWidth
    const containerWidth = container.clientWidth

    const visibleLeft = -translateX
    const visibleRight = visibleLeft + containerWidth

    let nextX = translateX

    // 左侧不可见
    if (itemLeft < visibleLeft) {
      nextX = -itemLeft
    }

    // 右侧不可见
    if (itemLeft + itemWidth > visibleRight) {
      nextX = -(itemLeft + itemWidth - containerWidth)
    }

    nextX = clampTranslate(nextX)

    if (nextX !== translateX) {
      setTranslateX(nextX)
      onIndexChange?.(nextX)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const update = () => updateButtonStatus()
    update()

    const resizeObserver = new ResizeObserver(() => update())
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [containerRef, updateButtonStatus])

  return {
    translateX,
    canScrollLeft,
    canScrollRight,
    moveLeft,
    moveRight,
    setTranslateX,
    scrollToIndex, // 👈 新增
  }
}
