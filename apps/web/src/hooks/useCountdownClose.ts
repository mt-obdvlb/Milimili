'use client'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useRef, useState } from 'react'

type UseCountdownCloseOptions = {
  duration?: number
  onComplete?: () => void
  interval?: number
}

export const useCountdownClose = (
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  options: UseCountdownCloseOptions = {}
) => {
  const { duration = 5, onComplete, interval = 0.1 } = options

  const [countdown, setCountdown] = useState(duration)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const countdownRef = useRef(duration) // 保存当前倒计时，避免每次 render 重置
  const autoCloseRef = useRef(false)

  useEffect(() => {
    if (!open) {
      if (autoCloseRef.current) {
        onComplete?.()
        autoCloseRef.current = false
      }

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      countdownRef.current = duration
      setCountdown(duration)
      return
    }

    // 打开时，只在第一次启动倒计时
    if (timerRef.current) return

    countdownRef.current = duration
    setCountdown(duration)

    const step = interval
    timerRef.current = setInterval(() => {
      countdownRef.current -= step
      if (countdownRef.current <= 0) {
        countdownRef.current = 0
        autoCloseRef.current = true
        clearInterval(timerRef.current!)
        timerRef.current = null
        setCountdown(0)
        setTimeout(() => setOpen(false), 0)
        return
      }
      setCountdown(parseFloat(countdownRef.current.toFixed(1)))
    }, step * 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return { countdown }
}
