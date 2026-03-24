'use client'

import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from 'react'
import { useDanmakuManager } from '@/features/danmaku/useDanmakuManager'
import { useDanmakuRuntime } from '@/features/danmaku'
import { VideoGetDetail } from '@mtobdvlb/shared-types'
import { cn } from '@/lib'
import { tv } from 'tailwind-variants'
import VideoPlayerController from '@/features/video/components/video-play/VideoPlayerController'
import { formatTime } from '@/utils'
import { useHistoryAdd } from '@/features'
import { useShow } from '@/hooks'
import { useVideoContext } from '@/features/video/components/video-play/VideoPlayerProvider'
import VideoEndWrapper from '@/features/video/components/video-play/VideoEndWrapper'

const VideoPlayer = ({
  videoDetail,
  setIsShowCursor,
  containerRef,
  isAutoPlayNext,
}: {
  containerRef: RefObject<HTMLDivElement | null>
  videoDetail: VideoGetDetail
  isShowCursor: boolean
  setIsShowCursor: Dispatch<SetStateAction<boolean>>
  isAutoPlayNext: boolean
}) => {
  const controllerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
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
  const { config } = useDanmakuRuntime()

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
    videoRef: videoElRef,
    paused,
    tooltipRef,
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
      tooltip: cn('text-xs leading-1 h-12  absolute w-[162px] z-999999 invisible'),
    },
  })

  const { toast, dm, state, controller, controllerMask, tooltip } = videoPlayerStyles()
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
          setShowDanmaku={() => undefined}
          showDanmaku={config.visible}
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
      <div ref={tooltipRef} className={tooltip()}>
        <div
          data-danmaku-tooltip-copy='true'
          className={
            'items-center rounded-[4px] cursor-pointer flex h-8 justify-center w-[32px] z-2 absolute top-2.5 left-16 hover:bg-[#2f3238e5] in-data-[type=top]:h-5'
          }
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            data-pointer='none'
            viewBox='0 0 24 25'
          >
            <path
              fill='#fff'
              d='M3 6.87a4 4 0 0 1 4-4h6.75a.75.75 0 0 1 0 1.5H7a2.5 2.5 0 0 0-2.5 2.5v9.75a.75.75 0 0 1-1.5 0V6.87Z'
            ></path>
            <path
              fill='#fff'
              d='M6 8.87a3 3 0 0 1 3-3h8.5a3 3 0 0 1 3 3v7.11a3.5 3.5 0 0 1-1.025 2.476l-3.39 3.389a3.5 3.5 0 0 1-2.474 1.025H9a3 3 0 0 1-3-3v-11Zm3-1.5a1.5 1.5 0 0 0-1.5 1.5v11a1.5 1.5 0 0 0 1.5 1.5h4.61a2 2 0 0 0 1.415-.586l3.39-3.389A2 2 0 0 0 19 15.981V8.87a1.5 1.5 0 0 0-1.5-1.5H9Z'
            ></path>
            <path
              fill='#fff'
              d='M16.25 17.62a1 1 0 0 0-1 1v2.75a.75.75 0 0 1-1.5 0v-2.75a2.5 2.5 0 0 1 2.5-2.5H19a.75.75 0 0 1 0 1.5h-2.75ZM9.75 11.62a.75.75 0 0 1 .75-.75H16a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75ZM9.75 15.12a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Z'
            ></path>
          </svg>
        </div>
        <div
          data-type={'bottom'}
          className={'absolute inset-0 origin-center in-data-[type=top]:rotate-180'}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            data-pointer='none'
            viewBox='0 0 162 48'
          >
            <path
              fill='#000'
              fillOpacity='.703'
              fillRule='evenodd'
              d='M1 27.075C1 16.07 9.92 7.149 20.925 7.149h55.91L81.522 1l4.741 6.15h54.812C152.079 7.15 161 16.07 161 27.074 161 38.079 152.079 47 141.075 47H20.925C9.921 47 1 38.08 1 27.075Z'
              clipRule='evenodd'
            ></path>
            <path
              stroke='#fff'
              strokeLinejoin='round'
              strokeOpacity='.496'
              d='M81.918.695a.5.5 0 0 0-.794.002l-4.536 5.952H20.925C9.645 6.65.5 15.794.5 27.075.5 38.355 9.645 47.5 20.925 47.5h120.15c11.28 0 20.425-9.145 20.425-20.425 0-11.281-9.145-20.426-20.425-20.426H86.509L81.918.695Z'
            ></path>
          </svg>
        </div>
      </div>
      {!isShow && <VideoEndWrapper isAutoPlayNext={isAutoPlayNext} videoDetail={videoDetail} />}
    </>
  )
}

export default VideoPlayer
