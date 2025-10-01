import { RefObject, useEffect, useState } from 'react'
import { useScroll } from 'react-use'

/**
 * Hook: 检测容器是否可以左右滚动
 * @param ref 容器 ref
 * @param deps 可选依赖，滚动状态在这些依赖变化时也会更新
 */
export const useCanScroll = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  deps: unknown[] = []
) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const { x } = useScroll(ref as RefObject<T>)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    setCanScrollLeft(x > 0)
    setCanScrollRight(el.scrollWidth - el.clientWidth - x > 0)
  }, [x, ref, deps])

  return { canScrollLeft, canScrollRight }
}
