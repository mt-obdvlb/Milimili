'use client'

import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

type InfiniteScrollCallback<T = unknown> = () => void | Promise<T>

export const useInfiniteScroll = <T = unknown>(
  callback: InfiniteScrollCallback<T>,
  options?: { rootMargin?: string; delay?: number }
) => {
  const { ref, inView } = useInView({
    rootMargin: options?.rootMargin ?? '100px',
    delay: options?.delay ?? 0,
  })

  useEffect(() => {
    if (inView) {
      void callback()
    }
  }, [inView, callback])

  return { ref }
}
