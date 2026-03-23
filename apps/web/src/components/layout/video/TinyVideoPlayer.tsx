'use client'

import { tv } from 'tailwind-variants'
import { useEffect, useRef, useState } from 'react'
import { formatTime } from '@/utils'
import { VideoListItem } from '@mtobdvlb/shared-types'
import { cn } from '@/lib'
import { NativeDanmakuEngine, useDanmakuGet } from '@/features/danmaku'

interface MainVideoPlayerProps {
  video: VideoListItem
  hover: boolean
  setTime: (time: number) => void
  time: number
  hiddenTime?: boolean
}

// 颜色字符串 '#ffffff' 转数字 0xffffff

const TINY_DANMAKU_CONFIG = {
  scale: 0.75,
  opacity: 1,
  areaRatio: 0.58,
  speed: 1,
  density: 0.85,
  hoverable: false,
}

const TinyVideoPlayer = ({
  hiddenTime,
  video,
  hover,
  setTime,
  time: currentTime,
}: MainVideoPlayerProps) => {
  const player = tv({
    slots: {
      base: 'flex size-full flex-col flex-nowrap abp',
      perch: 'flex items-center relative size-full justify-center',
      dm: 'contain-paint  size-full absolute left-0 overflow-hidden pointer-events-none mask-center top-0 z-2 select-none',
      time: 'absolute z-75 w-full bottom-0 left-0',
    },
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const topContainerRef = useRef<HTMLDivElement>(null)
  const bottomContainerRef = useRef<HTMLDivElement>(null)
  const scrollEngineRef = useRef<NativeDanmakuEngine | null>(null)
  const topEngineRef = useRef<NativeDanmakuEngine | null>(null)
  const bottomEngineRef = useRef<NativeDanmakuEngine | null>(null)

  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasPlayedRef = useRef(false)
  const [isPlay, setIsPlay] = useState(false)
  const { danmakuList } = useDanmakuGet(video.id, hover || isPlay)

  useEffect(() => {
    if (!scrollContainerRef.current || !topContainerRef.current || !bottomContainerRef.current)
      return

    const scrollEngine = new NativeDanmakuEngine(scrollContainerRef.current, 'scroll')
    const topEngine = new NativeDanmakuEngine(topContainerRef.current, 'top')
    const bottomEngine = new NativeDanmakuEngine(bottomContainerRef.current, 'bottom')

    scrollEngine.init()
    topEngine.init()
    bottomEngine.init()

    scrollEngine.setConfig(TINY_DANMAKU_CONFIG)
    topEngine.setConfig(TINY_DANMAKU_CONFIG)
    bottomEngine.setConfig(TINY_DANMAKU_CONFIG)

    scrollEngineRef.current = scrollEngine
    topEngineRef.current = topEngine
    bottomEngineRef.current = bottomEngine

    return () => {
      scrollEngine.destroy()
      topEngine.destroy()
      bottomEngine.destroy()
      scrollEngineRef.current = null
      topEngineRef.current = null
      bottomEngineRef.current = null
    }
  }, [])

  useEffect(() => {
    const scrollEngine = scrollEngineRef.current
    const topEngine = topEngineRef.current
    const bottomEngine = bottomEngineRef.current
    if (!scrollEngine || !topEngine || !bottomEngine) return

    const mapDanmaku = (item: (typeof danmakuList)[number]) => ({
      id: item.id,
      text: item.content,
      stime: item.time,
      size: item.fontSize,
      color: Number(`0x${item.color.replace(/^#/, '')}`),
    })

    scrollEngine.load(danmakuList.filter((item) => item.position === 'scroll').map(mapDanmaku))
    topEngine.load(danmakuList.filter((item) => item.position === 'top').map(mapDanmaku))
    bottomEngine.load(danmakuList.filter((item) => item.position === 'bottom').map(mapDanmaku))
  }, [danmakuList])

  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    let rafId: number | null = null

    const stopSyncLoop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }

    const sync = () => {
      const current = videoEl.currentTime
      scrollEngineRef.current?.time(current)
      topEngineRef.current?.time(current)
      bottomEngineRef.current?.time(current)
    }

    const syncFrame = () => {
      sync()
      if (!videoEl.paused && !videoEl.ended && hover) {
        rafId = requestAnimationFrame(syncFrame)
        return
      }
      rafId = null
    }

    const startSyncLoop = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(syncFrame)
    }

    const play = () => {
      startSyncLoop()
      scrollEngineRef.current?.start()
      topEngineRef.current?.start()
      bottomEngineRef.current?.start()
    }

    const pause = () => {
      stopSyncLoop()
      scrollEngineRef.current?.stop()
      topEngineRef.current?.stop()
      bottomEngineRef.current?.stop()
    }

    const updateRate = () => {
      const rate = videoEl.playbackRate || 1
      scrollEngineRef.current?.setPlaybackRate(rate)
      topEngineRef.current?.setPlaybackRate(rate)
      bottomEngineRef.current?.setPlaybackRate(rate)
    }

    sync()
    updateRate()
    videoEl.addEventListener('play', play)
    videoEl.addEventListener('playing', play)
    videoEl.addEventListener('pause', pause)
    videoEl.addEventListener('waiting', pause)
    videoEl.addEventListener('seeking', sync)
    videoEl.addEventListener('seeked', sync)
    videoEl.addEventListener('loadeddata', sync)
    videoEl.addEventListener('ratechange', updateRate)

    if (!videoEl.paused && hover) play()

    return () => {
      stopSyncLoop()
      videoEl.removeEventListener('play', play)
      videoEl.removeEventListener('playing', play)
      videoEl.removeEventListener('pause', pause)
      videoEl.removeEventListener('waiting', pause)
      videoEl.removeEventListener('seeking', sync)
      videoEl.removeEventListener('seeked', sync)
      videoEl.removeEventListener('loadeddata', sync)
      videoEl.removeEventListener('ratechange', updateRate)
    }
  }, [hover])

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
            className={'size-full object-contain bg-black'}
          />
        </div>
      </div>
      <div className={'absolute inset-0 overflow-hidden pointer-events-none!'}>
        <div className={cn(dm(), 'cnt')} ref={scrollContainerRef}></div>
        <div className={cn(dm(), 'cnt')} ref={topContainerRef}></div>
        <div className={cn(dm(), 'cnt')} ref={bottomContainerRef}></div>
      </div>
      {!hiddenTime && (
        <div className={time()}>
          <div className='pointer-events-none absolute right-[8px] bottom-[10px] z-2 flex items-center justify-center text-[13px] text-white text-shadow-[0_0_3px_rgba(0,0,0,0.6)]'>
            <div>{formatTime(Math.floor(currentTime))}</div>
            <div>/</div>
            <div>{formatTime(video.time)}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TinyVideoPlayer
