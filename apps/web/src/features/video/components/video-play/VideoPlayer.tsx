'use client'

import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from 'react'
import { useDanmakuManager } from '@/features/video/useDanmakuManager'
import { VideoGetDetail } from '@mtobdvlb/shared-types'
import { cn } from '@/lib'
import { tv } from 'tailwind-variants'
import VideoPlayerController from '@/features/video/components/video-play/VideoPlayerController'
import { formatTime } from '@/utils'
import { useHistoryAdd } from '@/features'
import { useShow } from '@/hooks'
import { useVideoContext } from '@/features/video/components/video-play/VideoPlayerProvider'
import VIdeoEndWrapper from '@/features/video/components/video-play/VIdeoEndWrapper'

const VideoPlayer = ({
  videoDetail,
  setIsShowCursor,
  showDanmaku,
  setShowDanmaku,
  containerRef,
  isAutoPlayNext,
}: {
  containerRef: RefObject<HTMLDivElement | null>
  videoDetail: VideoGetDetail
  isShowCursor: boolean
  setIsShowCursor: Dispatch<SetStateAction<boolean>>
  showDanmaku: boolean
  setShowDanmaku: Dispatch<SetStateAction<boolean>>
  isAutoPlayNext: boolean
}) => {
  const controllerRef = useRef<HTMLDivElement>(null)
  const [isShowController, setIsShowController] = useState(true)
  const [isShowToast, setIsShowToast] = useState(false)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const { historyAdd } = useHistoryAdd()
  const { isShow } = useShow(500)

  const {
    videoRef: videoElRef,
    seek,
    paused,
    togglePlay,
    progress,
    isFullScreen,
    isPlayed,
    isEnded,
    duration,
    isWebFull,
  } = useVideoContext()

  useEffect(() => {
    const video = videoElRef.current
    if (!video || !videoDetail.video.duration || !duration) return

    const seekTime = Math.max(Math.min(videoDetail.video.duration, duration - 5), 0)
    const timeout: { id: NodeJS.Timeout | null } = { id: null }

    const showToast = () => {
      setIsShowToast(true)
      timeout.id = setTimeout(() => setIsShowToast(false), 5000)
    }

    const handleLoadedMetadata = () => {
      // metadata 加载完才 seek
      seek(seekTime)
      showToast()
    }

    // 视频已加载 metadata，则立即执行
    if (video.readyState >= 1) handleLoadedMetadata()
    else video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true })

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      if (timeout.id) clearTimeout(timeout.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoDetail.video.duration, videoElRef, duration])

  useEffect(() => {
    const container = containerRef.current
    const controllerEl = controllerRef.current
    if (!container || !controllerEl || !isPlayed) return

    let isMouseInController = false
    let lastMoveTime = 0
    const THROTTLE_INTERVAL = 100

    const clearHideTimeout = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
    }

    const scheduleHide = () => {
      clearHideTimeout()
      hideTimeoutRef.current = setTimeout(() => {
        if (!isMouseInController) {
          setIsShowController(false)
          setIsShowCursor(false)
        }
      }, 1000)
    }

    const onMouseMove = () => {
      const now = Date.now()
      if (now - lastMoveTime < THROTTLE_INTERVAL) return
      lastMoveTime = now

      setIsShowController(true)
      setIsShowCursor(true)
      scheduleHide()
    }

    const onMouseLeave = () => {
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
      scheduleHide()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, isPlayed])

  useEffect(() => {
    const videoId = videoDetail.video.id
    if (!videoId) return

    let interval: NodeJS.Timeout | null = null

    const saveProgress = () => {
      const video = videoElRef.current
      if (!video) return
      const time = video.currentTime
      if (time < 5) return
      void historyAdd({ videoId, duration: time })
    }

    const startInterval = () => {
      if (interval) return
      interval = setInterval(saveProgress, 3000)
    }

    const stopInterval = () => {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
    }

    // 播放/暂停控制定时器
    if (videoElRef.current && !paused) startInterval()

    // 监听播放状态变化
    const handlePlay = () => startInterval()
    const handlePause = () => stopInterval()

    const video = videoElRef.current
    video?.addEventListener('play', handlePlay)
    video?.addEventListener('pause', handlePause)

    // 页面隐藏/刷新时立即保存
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') saveProgress()
    }
    window.addEventListener('beforeunload', saveProgress)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      stopInterval()
      saveProgress()
      video?.removeEventListener('play', handlePlay)
      video?.removeEventListener('pause', handlePause)
      window.removeEventListener('beforeunload', saveProgress)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [videoDetail.video.id, paused, historyAdd, videoElRef])

  const { bottomContainerRef, topContainerRef, scrollContainerRef } = useDanmakuManager({
    videoId: videoDetail.video.id,
    videoRef: videoElRef, // 传 RefObject
    showDanmaku,
  })

  const videoPlayerStyles = tv({
    slots: {
      dm: cn('absolute inset-0 z-2 pointer-events-none overflow-hidden', isEnded && 'hidden'),
      state: cn(
        'absolute bottom-[62px] cursor-pointer pointer-events-none  right-[34px] z-48',
        isShow && 'hidden'
      ),
      controller: cn(
        'absolute bottom-0 left-0 w-full z-75',
        (isFullScreen || isWebFull) && 'h-[73px] leading-[73px]',
        isShow && 'hidden'
      ),
      controllerMask: cn(
        "opacity-0  w-full -z-1 transition-opacity pointer-events-none duration-200 ease-in-out absolute bottom-0 left-0 h-25 bg-[url('/images/video-controller-mask.png')_repeat-x_bottom]",
        (isShowController || isDragging) && 'opacity-100',
        isShow && 'hidden'
      ),
      toast: cn(
        'absolute select-none z-76 pointer-events-none leading-7 leaft-2.5 bottom-15 text-[14px]',
        isShow && 'hidden'
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
        {paused && (
          <div
            onClick={() => togglePlay()}
            className={"bg-[url('/svgs/video-play.svg')] size-16 block"}
          ></div>
        )}
      </div>
      <div ref={controllerRef} className={controller()}>
        <div className={controllerMask()}></div>
        <VideoPlayerController
          videoDetail={videoDetail}
          setShowDanmaku={setShowDanmaku}
          showDanmaku={showDanmaku}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          isShowController={isShowController}
          containerRef={containerRef}
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
                  seek(0)
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
      <div className={cn('group cursor-move absolute z-12 inset-0', !isShow && 'hidden')}>
        {/*<div*/}
        {/*  className={*/}
        {/*    'opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out cursor-pointer fill-white! float-right h-[26px] mr-2 mt-2 w-[26px]'*/}
        {/*  }*/}
        {/*>*/}
        {/*  <svg*/}
        {/*    xmlns='http://www.w3.org/2000/svg'*/}
        {/*    data-pointer='none'*/}
        {/*    viewBox='0 0 16 16'*/}
        {/*  >*/}
        {/*    <path d='m8 6.939 3.182-3.182a.75.75 0 1 1 1.061 1.061L9.061 8l3.182 3.182a.75.75 0 1 1-1.061 1.061L8 9.061l-3.182 3.182a.75.75 0 1 1-1.061-1.061L6.939 8 3.757 4.818a.75.75 0 1 1 1.061-1.061L8 6.939z'></path>*/}
        {/*  </svg>*/}
        {/*</div>*/}
        <div
          className={
            'size-25 left-1/2 top-1/2 -mt-[50px] -ml-[50px] cursor-pointer opacity-0 absolute group-hover:opacity-100 transition-opacity duration-200 ease-in-out'
          }
          onClick={() => togglePlay()}
        >
          <div
            className={'inset-0 absolute bg-[size:80px_80px] bg-no-repeat bg-center'}
            style={{
              backgroundImage: `url('${paused ? '/svgs/play.svg' : '/svgs/pause.svg'}')`,
            }}
          ></div>
        </div>
        <div
          className={
            'bg-[hsla(0,0%,100%,.2)] rounded-[1.5px] bottom-0 inset-x-0 h-[3px] pointer-events-none absolute overflow-hidden'
          }
        >
          <div
            style={{ transform: `scaleX(${Math.min(progress + 0.05, 1)})` }}
            className={'bg-[hsla(0,0%,100%,.3)] inset-0 absolute origin-[0_0]'}
          ></div>
          <div
            style={{ transform: `scaleX(${progress})` }}
            className={'bg-[#00a1d6] inset-0 absolute origin-[0_0]'}
          ></div>
        </div>
      </div>
      {!isShow && <VIdeoEndWrapper isAutoPlayNext={isAutoPlayNext} videoDetail={videoDetail} />}
    </>
  )
}

export default VideoPlayer
