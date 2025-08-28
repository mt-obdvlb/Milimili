'use client'

import { tv } from 'tailwind-variants'
import { RefObject, useEffect, useRef, useState } from 'react'
import { formatTime } from '@/utils'
import { useDanmakuGet } from '@/features/danmaku/api'
import { VideoListItem } from '@mtobdvlb/shared-types'
import { cn } from '@/lib'

interface MainVideoPlayerProps {
  video: VideoListItem
  hover: boolean
  setTime: (time: number) => void
  time: number
}

// 颜色字符串 '#ffffff' 转数字 0xffffff
const hexToNumber = (hex: string) => Number(`0x${hex.replace(/^#/, '')}`)

const HomeMainVideoPlayer = ({
  video,
  hover,
  setTime,
  time: currentTime,
}: MainVideoPlayerProps) => {
  const player = tv({
    slots: {
      base: 'flex size-full flex-col flex-nowrap abp',
      perch: 'flex items-center relative size-full justify-center',
      dm: 'contain-paint cursor-pointer size-full absolute left-0 overflow-hidden pointer-events-none mask-center top-0 z-2 select-none',
      time: 'absolute z-75 w-full bottom-0 left-0',
    },
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const topContainerRef = useRef<HTMLDivElement>(null)
  const bottomContainerRef = useRef<HTMLDivElement>(null)

  const scrollCMRef = useRef<CommentManager>(null)
  const topCMRef = useRef<CommentManager>(null)
  const bottomCMRef = useRef<CommentManager>(null)

  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasPlayedRef = useRef(false)
  const [isPlay, setIsPlay] = useState(false)

  const { danmakuList } = useDanmakuGet(video.id, isPlay)

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

  // 绑定视频事件
  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    const startAll = () => {
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
      setTime(t)
    }

    videoEl.addEventListener('play', startAll)
    videoEl.addEventListener('pause', stopAll)
    videoEl.addEventListener('timeupdate', timeUpdateAll)

    return () => {
      videoEl.removeEventListener('play', startAll)
      videoEl.removeEventListener('pause', stopAll)
      videoEl.removeEventListener('timeupdate', timeUpdateAll)
    }
  }, [setTime])

  // 加载弹幕
  useEffect(() => {
    if (!danmakuList || danmakuList.length === 0) return

    const scrollCM = scrollCMRef.current
    const topCM = topCMRef.current
    const bottomCM = bottomCMRef.current
    if (!scrollCM || !topCM || !bottomCM) return

    // 清空旧弹幕
    scrollCM.clear()
    topCM.clear()
    bottomCM.clear()

    const containerWidth = scrollContainerRef.current?.offsetWidth || 0

    // 根据 position 分组并生成 CCL 对象
    const createDanmaku = (item: (typeof danmakuList)[0]) => ({
      text: item.content,
      mode: item.position === 'scroll' ? 1 : item.position === 'top' ? 5 : 4,
      stime: item.time,
      size: 16,
      color: hexToNumber(item.color || '#ffffff'),
      left: containerWidth, // 滚动弹幕需要
      align: item.position === 'scroll' ? undefined : 'center',
    })

    const scrollDanmaku = danmakuList.filter((d) => d.position === 'scroll').map(createDanmaku)
    const topDanmaku = danmakuList.filter((d) => d.position === 'top').map(createDanmaku)
    const bottomDanmaku = danmakuList.filter((d) => d.position === 'bottom').map(createDanmaku)

    // 异步 load 保证 container 宽度生效
    setTimeout(() => {
      if (scrollDanmaku.length) scrollCM.load(scrollDanmaku)
      if (topDanmaku.length) topCM.load(topDanmaku)
      if (bottomDanmaku.length) bottomCM.load(bottomDanmaku)

      scrollCM.start()
      topCM.start()
      bottomCM.start()
    }, 0)
  }, [danmakuList])

  // hover 播放逻辑
  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    if (hover) {
      if (!hasPlayedRef.current) {
        setIsPlay(true)
        hasPlayedRef.current = true
      }
      hoverTimeout.current = setTimeout(() => {
        void videoEl.play().catch(() => {})
      }, 200)
    } else {
      videoEl.pause()
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current)
        hoverTimeout.current = null
      }
      setTime(videoEl.currentTime >= 3 ? videoEl.currentTime : 0)
    }
  }, [hover, setTime])

  const { base, perch, dm, time } = player()

  return (
    <div className={base()}>
      <div className={perch()}>
        <div className='size-full overflow-hidden'>
          <video
            src={video.url}
            ref={videoRef}
            autoPlay={false}
            muted
            loop
            playsInline
            preload='metadata'
          />
        </div>
      </div>
      <div className={'absolute inset-0 overflow-hidden'}>
        <div className={cn(dm(), 'cnt')} ref={scrollContainerRef}></div>
        <div className={cn(dm(), 'cnt')} ref={topContainerRef}></div>
        <div className={cn(dm(), 'cnt')} ref={bottomContainerRef}></div>
      </div>
      <div className={time()}>
        <div className='pointer-events-none absolute right-[8px] bottom-[10px] z-2 flex items-center justify-center text-[13px] text-white text-shadow-[0_0_3px_rgba(0,0,0,0.6)]'>
          <div>{formatTime(Math.floor(currentTime))}</div>
          <div>/</div>
          <div>{formatTime(video.time)}</div>
        </div>
      </div>
    </div>
  )
}

export default HomeMainVideoPlayer
