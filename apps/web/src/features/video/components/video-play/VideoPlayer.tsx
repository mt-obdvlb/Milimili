'use client'

import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from 'react'
import DPlayer from 'dplayer'
import { useDanmakuManager } from '@/features/video/useDanmakuManager'
import { VideoGetDetail } from '@mtobdvlb/shared-types'
import { cn } from '@/lib'
import { tv } from 'tailwind-variants'
import VideoPlayerController from '@/features/video/components/video-play/VideoPlayerController'
import { formatTime } from '@/utils'
import { useHistoryAdd } from '@/features'

const VideoPlayer = ({
  dpRef,
  dpContainerRef,
  videoDetail,
  setIsShowCursor,
  isWebFull,
  setIsWebFull,
  showDanmaku,
}: {
  dpRef: RefObject<DPlayer | null>
  dpContainerRef: RefObject<HTMLDivElement | null>
  videoDetail: VideoGetDetail
  isShowCursor: boolean
  setIsShowCursor: Dispatch<SetStateAction<boolean>>
  isWebFull: boolean
  setIsWebFull: Dispatch<SetStateAction<boolean>>
  showDanmaku: boolean
  setShowDanmaku: Dispatch<SetStateAction<boolean>>
}) => {
  const videoElRef = useRef<HTMLVideoElement | null>(null)
  const controllerRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isShowController, setIsShowController] = useState(true)
  const [isShowToast, setIsShowToast] = useState(false)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const { historyAdd } = useHistoryAdd()

  useEffect(() => {
    if (!dpRef.current) return
    const videoEl = dpRef.current?.video
    if (videoEl) videoElRef.current = videoEl
  }, [dpRef])

  useEffect(() => {
    const video = videoElRef.current
    if (!video) return

    setPaused(video.paused)
    const onPlay = () => setPaused(false)
    const onPause = () => setPaused(true)

    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)

    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
    }
  }, [])

  useEffect(() => {
    const dp = dpRef.current
    const seekTime = videoDetail.video.duration
    if (!dp || !seekTime) return

    let timeout: NodeJS.Timeout | null = null

    const showToast = () => {
      setIsShowToast(true)
      timeout = setTimeout(() => setIsShowToast(false), 5000)
    }

    const handleLoaded = () => {
      dp.seek(seekTime)
      showToast()
    }

    if (dp.video.readyState >= 1) {
      handleLoaded()
    } else {
      dp.video.addEventListener('loadedmetadata', handleLoaded, { once: true })
    }

    return () => {
      dp.video.removeEventListener('loadedmetadata', handleLoaded)
      if (timeout) clearTimeout(timeout)
    }
  }, [videoDetail.video.duration, dpRef])

  useEffect(() => {
    const container = dpContainerRef.current
    const controllerEl = controllerRef.current
    if (!container || !controllerEl) return

    const clearHideTimeout = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
    }

    // 节流相关
    let lastMoveTime = 0
    const THROTTLE_INTERVAL = 100 // 节流间隔（ms）
    let isMouseInController = false // 鼠标是否在控制条内

    const onMouseMove = () => {
      const now = Date.now()
      if (now - lastMoveTime < THROTTLE_INTERVAL) return
      lastMoveTime = now

      setIsShowController(true)
      setIsShowCursor(true)
      clearHideTimeout()

      hideTimeoutRef.current = setTimeout(() => {
        // 只有当鼠标不在控制条内才隐藏
        if (!isMouseInController) {
          setIsShowController(false)
          setIsShowCursor(false)
        }
      }, 1000)
    }

    const onMouseLeave = () => {
      // 鼠标离开 container 时仍然显示 cursor
      setIsShowController(false)
      setIsShowCursor(true)
      clearHideTimeout()
    }

    const onControllerMouseEnter = () => {
      isMouseInController = true
      setIsShowController(true)
      setIsShowCursor(true)
      clearHideTimeout()
    }

    const onControllerMouseLeave = () => {
      isMouseInController = false
      // 离开控制条后，重新触发隐藏逻辑
      hideTimeoutRef.current = setTimeout(() => {
        setIsShowController(false)
        setIsShowCursor(false)
      }, 1000)
    }

    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseleave', onMouseLeave)
    controllerEl.addEventListener('mouseenter', onControllerMouseEnter)
    controllerEl.addEventListener('mouseleave', onControllerMouseLeave)

    return () => {
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)
      controllerEl.removeEventListener('mouseenter', onControllerMouseEnter)
      controllerEl.removeEventListener('mouseleave', onControllerMouseLeave)
      clearHideTimeout()
    }
  }, [dpContainerRef, setIsShowController, setIsShowCursor])

  useEffect(() => {
    const saveProgress = () => {
      if ((videoElRef.current?.currentTime ?? 0) < 5) return
      void historyAdd({
        videoId: videoDetail.video.id,
        duration: videoElRef.current?.currentTime ?? 5,
      })
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') saveProgress()
    }

    window.addEventListener('beforeunload', saveProgress)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      saveProgress()
      window.removeEventListener('beforeunload', saveProgress)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [videoDetail.video.id, historyAdd])

  useEffect(() => {
    const video = videoElRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [videoElRef])

  const { bottomContainerRef, topContainerRef, scrollContainerRef } = useDanmakuManager({
    videoId: videoDetail.video.id,
    videoRef: videoElRef, // 传 RefObject
    showDanmaku,
  })

  const videoPlayerStyles = tv({
    slots: {
      dm: cn('absolute inset-0 z-2 pointer-events-none overflow-hidden'),
      state: cn('absolute bottom-[62px] cursor-pointer pointer-events-none  right-[34px] z-48'),
      controller: cn(
        'absolute bottom-0 left-0 w-full z-75',
        isFullScreen && 'h-[73px] leading-[73px]'
      ),
      controllerMask: cn(
        "opacity-0  w-full -z-1 transition-opacity duration-200 ease-in-out absolute bottom-0 left-0 h-25 bg-[url('/images/video-controller-mask.png')_repeat-x_bottom]",
        (isShowController || isDragging) && 'opacity-100'
      ),
      toast: cn(
        'absolute select-none z-76 pointer-events-none leading-7 leaft-2.5 bottom-15 text-[14px]'
      ),
    },
  })

  const { toast, dm, state, controller, controllerMask } = videoPlayerStyles()

  return (
    <>
      <div className={dm()}>
        <div
          className={cn(
            'contain-paint cursor-pointer size-full absolute left-0 overflow-hidden pointer-events-none mask-center top-0 z-2 select-none',
            'cnt'
          )}
          ref={scrollContainerRef}
        ></div>
        <div
          className={cn(
            'contain-paint cursor-pointer size-full absolute left-0 overflow-hidden pointer-events-none mask-center top-0 z-2 select-none',
            'cnt'
          )}
          ref={topContainerRef}
        ></div>
        <div
          className={cn(
            'contain-paint cursor-pointer size-full absolute left-0 overflow-hidden pointer-events-none mask-center top-0 z-2 select-none',
            'cnt'
          )}
          ref={bottomContainerRef}
        ></div>
      </div>
      <div className={state()}>
        {paused && <div className={"bg-[url('/svgs/video-play.svg')] size-16 block"}></div>}
      </div>
      <div ref={controllerRef} className={controller()}>
        <div className={controllerMask()}></div>
        <VideoPlayerController
          setCurrentTime={setCurrentTime}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          dpContainerRef={dpContainerRef}
          isWebFull={isWebFull}
          setIsWebFull={setIsWebFull}
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
          paused={paused}
          dpRef={dpRef}
          isShowController={isShowController}
          currentTime={currentTime}
        />
      </div>
      <div className={toast()}>
        <div
          className={cn(
            'opacity-100 overflow-hidden transition-all duration-250 ease-out will-change-[height,opacity]'
          )}
        >
          {isShowToast && videoDetail.video.duration > 5 && (
            <div
              className={
                'pointer-events-auto py-[7px] px-4 mt-2.5 inline-flex text-white rounded-[4px] bg-[rgba(25,25,25,.88)] items-center'
              }
            >
              <span
                onClick={() => setIsShowToast(false)}
                className={'fill-white cursor-pointer size-6 mr-1.5'}
              >
                <svg xmlns='http://www.w3.org/2000/svg' data-pointer='none' viewBox='0 0 16 16'>
                  <path d='m8 6.939 3.182-3.182a.75.75 0 1 1 1.061 1.061L9.061 8l3.182 3.182a.75.75 0 1 1-1.061 1.061L8 9.061l-3.182 3.182a.75.75 0 1 1-1.061-1.061L6.939 8 3.757 4.818a.75.75 0 1 1 1.061-1.061L8 6.939z'></path>
                </svg>
              </span>
              <span
                className={'max-w-[32em] overflow-hidden text-ellipsis whitespace-nowrap'}
              >{`已为您定位至${formatTime(videoDetail.video.duration)}`}</span>
              <span
                onClick={() => {
                  dpRef.current?.seek(0)
                  setIsShowToast(false)
                }}
                className={
                  'text-[#f25d8e] cursor-pointer ml-3 transition-colors duration-150 ease-in-out hover:text-[#ff85ad]'
                }
              >
                从头播放
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default VideoPlayer
