'use client'
import { useEffect, useMemo, useRef } from 'react'

type UnknownType = (...args: unknown[]) => void

export const useDebounceFn = <T extends UnknownType>(fn: T, delay: number = 50) => {
  const fnRef = useRef<T>(fn)
  useEffect(() => {
    fnRef.current = fn
  }, [fn])
  const debounceFn = useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    const debounced = (...args: Parameters<T>) => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        fnRef.current(...args)
      }, delay)
    }
    const cancel = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = null
    }
    return Object.assign(debounced, { cancel })
  }, [delay])
  useEffect(() => {
    return () => {
      debounceFn.cancel()
    }
  }, [debounceFn])
  return debounceFn
}
