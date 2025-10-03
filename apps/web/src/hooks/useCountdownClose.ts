import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useRef, useState } from 'react'

export const useCountdownClose = (
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  duration: number = 5
) => {
  const [countdown, setCountdown] = useState(duration)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // 如果手动关闭了，清理定时器，重置倒计时
    if (!open) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      setCountdown(duration)
      return
    }

    // 打开时，启动倒计时
    setCountdown(duration)
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
          // 避免在渲染中直接 setState
          setTimeout(() => setOpen(false), 0)
          return duration
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [open, setOpen, duration])

  return { countdown }
}
