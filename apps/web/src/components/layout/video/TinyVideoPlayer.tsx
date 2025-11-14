'use client'

import { tv } from 'tailwind-variants'
import { useEffect, useRef, useState } from 'react'
import { formatTime } from '@/utils'
import { VideoListItem } from '@mtobdvlb/shared-types'
import { cn } from '@/lib'
import { useDanmakuManager } from '@/features/video/useDanmakuManager'

interface MainVideoPlayerProps {
  video: VideoListItem
  hover: boolean
  setTime: (time: number) => void
  time: number
  hiddenTime?: boolean
}

// 颜色字符串 '#ffffff' 转数字 0xffffff

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
      dm: 'contain-paint cursor-pointer size-full absolute left-0 overflow-hidden pointer-events-none mask-center top-0 z-2 select-none',
      time: 'absolute z-75 w-full bottom-0 left-0',
    },
  })

  const videoRef = useRef<HTMLVideoElement>(null)

  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasPlayedRef = useRef(false)
  const [isPlay, setIsPlay] = useState(false)

  // 初始化 CommentManager

  // 绑定视频事件
  const { bottomContainerRef, topContainerRef, scrollContainerRef } = useDanmakuManager({
    videoId: video.id,
    isPlay,
    videoRef,
    setTime,
  })

  // 加载弹幕

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
      <div className={'absolute inset-0 overflow-hidden'}>
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
