import { DanmakuGetItem } from '@/types/danmaku'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib'

const MainVideoPlayerDanmakuItem = ({ danmaku }: { danmaku: DanmakuGetItem }) => {
  const elRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const containerHeight = el.parentElement?.clientHeight ?? 400
    const containerWidth = el.parentElement?.clientWidth ?? 600
    const randomY = Math.floor(Math.random() * (containerHeight - 30)) // 避免固定位置过密

    let frameId: number
    let timerId: NodeJS.Timeout

    if (danmaku.position === 'scroll' || !danmaku.position) {
      // 滚动弹幕
      const elWidth = el.offsetWidth
      const startX = containerWidth
      const endX = -elWidth
      const y = randomY
      const duration = 8000 // 8s 滚动

      let start: number | null = null
      const step = (timestamp: number) => {
        if (!start) start = timestamp
        const progress = Math.min((timestamp - start) / duration, 1)
        const x = startX + (endX - startX) * progress
        if (el) el.style.transform = `translate(${x}px, ${y}px)`

        if (progress < 1) {
          frameId = requestAnimationFrame(step)
        } else {
          setVisible(false) // React 控制卸载
        }
      }

      frameId = requestAnimationFrame(step)
    } else {
      // 顶部或底部固定弹幕
      el.style.top = danmaku.position === 'top' ? '5px' : 'unset'
      el.style.bottom = danmaku.position === 'bottom' ? '5px' : 'unset'
      el.style.left = '50%'
      el.style.transform = 'translateX(-50%)'

      timerId = setTimeout(() => setVisible(false), 4000)
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId)
      if (timerId) clearTimeout(timerId)
    }
  }, [danmaku.position])

  return visible ? (
    <div
      ref={elRef}
      className={cn(
        'text-shadow absolute top-[10px] text-[16px] whitespace-nowrap opacity-80',
        `text-[${danmaku.color}]`
      )}
    >
      {danmaku.content}
    </div>
  ) : null
}

export default MainVideoPlayerDanmakuItem
