'use client'
import { useEffect, useMemo, useRef } from 'react'

type UnknownType = (...args: unknown[]) => void

export const useThrottleFn = <T extends UnknownType>(fn: T, delay: number = 50) => {
  const fnRef = useRef<T>(fn)
  const lastExecRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    fnRef.current = fn
  }, [fn])
  const throttleFn = useMemo(() => {
    const throttled = (...args: Parameters<T>) => {
      const now = Date.now()
      const remaining = delay - (now - lastExecRef.current)
      if (remaining <= 0) {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
        fnRef.current(...args)
        lastExecRef.current = now
      } else if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          fnRef.current(...args)
          lastExecRef.current = Date.now()
          timerRef.current = null
        }, remaining)
      }
    }
    const cancel = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = null
    }
    return Object.assign(throttled, { cancel })
  }, [delay])
  useEffect(() => {
    return () => {
      throttleFn.cancel()
    }
  }, [throttleFn])
  return throttleFn
}
