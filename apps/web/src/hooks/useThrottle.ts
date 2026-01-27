'use client'
import { useEffect, useRef, useState } from 'react'

export const useThrottle = <T>(value: T, delay: number = 50): T => {
  const [throttled, setThrottled] = useState(value)
  const lastExecRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    const now = Date.now()
    const remaining = delay - (now - lastExecRef.current)
    if (remaining <= 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      setThrottled(value)
      lastExecRef.current = now
    } else if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        setThrottled(value)
        lastExecRef.current = Date.now()
        timerRef.current = null
      }, remaining)
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [value, delay])
  return throttled
}
