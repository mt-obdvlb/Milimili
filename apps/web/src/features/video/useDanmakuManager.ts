import { RefObject, useEffect, useRef } from 'react'
import { VideoGetDanmakusItem } from '@mtobdvlb/shared-types'
import { useDanmakuGet } from '@/features/danmaku/api'

interface UseDanmakuManagerProps {
  videoId: string
  videoRef: RefObject<HTMLVideoElement | null>
  isPlay?: boolean
  setTime?: (time: number) => void
  showDanmaku?: boolean // 父组件控制
}

export const useDanmakuManager = ({
  videoId,
  videoRef,
  isPlay,
  setTime,
  showDanmaku = true, // 默认显示
}: UseDanmakuManagerProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const topContainerRef = useRef<HTMLDivElement>(null)
  const bottomContainerRef = useRef<HTMLDivElement>(null)

  const scrollCMRef = useRef<CommentManager | null>(null)
  const topCMRef = useRef<CommentManager | null>(null)
  const bottomCMRef = useRef<CommentManager | null>(null)

  const { danmakuList } = useDanmakuGet(videoId, isPlay)

  // 初始化 CommentManager
  useEffect(() => {
    if (!window.CommentManager) return

    const initCM = (ref: RefObject<HTMLDivElement | null>) => {
      if (!ref.current) return null
      const cm = new window.CommentManager(ref.current)
      cm.init()
      cm.options.global.scale = 1.5
      return cm
    }

    scrollCMRef.current = initCM(scrollContainerRef)
    topCMRef.current = initCM(topContainerRef)
    bottomCMRef.current = initCM(bottomContainerRef)
  }, [])

  // 视频事件绑定
  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    const startAll = () => {
      if (!showDanmaku) return
      scrollCMRef.current?.start()
      topCMRef.current?.start()
      bottomCMRef.current?.start()
    }

    const stopAll = () => {
      scrollCMRef.current?.stop()
      topCMRef.current?.stop()
      bottomCMRef.current?.stop()
    }

    const timeUpdateAll = () => {
      const t = videoEl.currentTime
      scrollCMRef.current?.time(t)
      topCMRef.current?.time(t)
      bottomCMRef.current?.time(t)
      setTime?.(t)
    }

    videoEl.addEventListener('play', startAll)
    videoEl.addEventListener('pause', stopAll)
    videoEl.addEventListener('timeupdate', timeUpdateAll)

    return () => {
      videoEl.removeEventListener('play', startAll)
      videoEl.removeEventListener('pause', stopAll)
      videoEl.removeEventListener('timeupdate', timeUpdateAll)
    }
  }, [setTime, videoRef, showDanmaku])

  // 加载弹幕
  useEffect(() => {
    if (!danmakuList || danmakuList.length === 0) return

    const scrollCM = scrollCMRef.current
    const topCM = topCMRef.current
    const bottomCM = bottomCMRef.current
    if (!scrollCM || !topCM || !bottomCM) return

    if (!showDanmaku) {
      // 关闭弹幕就 stop
      scrollCM.stop()
      topCM.stop()
      bottomCM.stop()
      return
    }

    // 清空旧弹幕
    scrollCM.clear()
    topCM.clear()
    bottomCM.clear()

    const containerWidth = scrollContainerRef.current?.offsetWidth || 0

    const createDanmaku = (item: VideoGetDanmakusItem) => ({
      text: item.content,
      mode: item.position === 'scroll' ? 1 : item.position === 'top' ? 5 : 4,
      stime: item.time,
      size: 16,
      color: Number(`0x${(item.color || '#ffffff').replace(/^#/, '')}`),
      left: containerWidth,
      align: item.position === 'scroll' ? undefined : 'center',
    })

    const scrollDanmaku = danmakuList.filter((d) => d.position === 'scroll').map(createDanmaku)
    const topDanmaku = danmakuList.filter((d) => d.position === 'top').map(createDanmaku)
    const bottomDanmaku = danmakuList.filter((d) => d.position === 'bottom').map(createDanmaku)

    setTimeout(() => {
      if (scrollDanmaku.length) scrollCM.load(scrollDanmaku)
      if (topDanmaku.length) topCM.load(topDanmaku)
      if (bottomDanmaku.length) bottomCM.load(bottomDanmaku)

      scrollCM.start()
      topCM.start()
      bottomCM.start()
    }, 0)
  }, [danmakuList, showDanmaku])

  return {
    scrollContainerRef,
    topContainerRef,
    bottomContainerRef,
  }
}
