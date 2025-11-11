'use client'
import { tv } from 'tailwind-variants'
import { cn } from '@/lib'
import {
  Dispatch,
  MouseEventHandler,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import DPlayer from 'dplayer'
import Image from 'next/image'
import { formatTime, useThrottle } from '@/utils'
import { useDebounce } from '@/utils/debounce'

// 🧩 新增：通用防抖与节流 hooks

interface VideoPlayerControllerTopProps {
  progressTranslate: number
  dpRef: RefObject<DPlayer | null>
  currentTime: number
  isDragging: boolean
  setIsDragging: Dispatch<SetStateAction<boolean>>
  setCurrentTime: Dispatch<SetStateAction<number>>
}

const VideoPlayerControllerTop = ({
  progressTranslate,
  setCurrentTime,
  dpRef,
  isDragging,
  setIsDragging,
  currentTime,
}: VideoPlayerControllerTopProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [thumbTranslate, setThumbTranslate] = useState(0)
  const [moveIndicatorRaw, setMoveIndicatorRaw] = useState(0)
  const [isHover, setIsHover] = useState(false)
  const [hoverTime, setHoverTime] = useState<number>(isFinite(currentTime) ? currentTime : 0)
  const [url, setUrl] = useState('')
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const frameVideoRef = useRef<HTMLVideoElement | null>(null)

  const controllerTopStyles = tv({
    slots: {
      base: cn(
        'h-1 w-full transition-[transform_.1s_cubic_bezier(0,0,.2,1)] flex relative items-center'
      ),
      schedule: cn('size-full absolute'),
      thumb: cn('size-5 pointer-events-none'),
      moveIndicator: cn(
        'w-2 h-4 -ml-1 opacity-0 overflow-hidden absolute transition-opacity duration-100',
        isHover && !isDragging && 'opacity-100'
      ),
      popup: cn(
        'rounded-[2px] bottom-[22px] leading-9 overflow-hidden absolute pointer-events-none w-40 hidden',
        (isDragging || isHover) && 'block'
      ),
    },
  })

  const { base, schedule, thumb, moveIndicator, popup } = controllerTopStyles()

  const containerWidth = containerRef.current?.offsetWidth || 0
  const videoDuration = dpRef.current?.video?.duration || 1
  const mainVideo = dpRef.current?.video

  // 初始化隐藏的视频实例
  useEffect(() => {
    if (!mainVideo) return
    const frameVideo = document.createElement('video')
    frameVideo.src = mainVideo.src
    frameVideo.crossOrigin = 'anonymous'
    frameVideo.style.display = 'none'
    frameVideo.preload = 'metadata'
    document.body.appendChild(frameVideo)
    frameVideoRef.current = frameVideo

    return () => {
      if (frameVideoRef.current) {
        document.body.removeChild(frameVideoRef.current)
        frameVideoRef.current = null
      }
    }
  }, [mainVideo?.src, mainVideo])

  const captureFrame = useCallback(
    async (targetTime: number) => {
      const frameVideo = frameVideoRef.current
      const mainVideo = dpRef.current?.video
      if (!frameVideo || !mainVideo || mainVideo.duration <= 0) return null
      const validTime = Math.max(0, Math.min(mainVideo.duration, targetTime))
      if (!isFinite(validTime)) return null

      if (frameVideo.readyState < 2) {
        await new Promise((resolve) =>
          frameVideo.addEventListener('loadeddata', resolve, { once: true })
        )
      }

      frameVideo.currentTime = validTime
      await new Promise((resolve) => frameVideo.addEventListener('seeked', resolve, { once: true }))

      const canvas = document.createElement('canvas')
      canvas.width = frameVideo.videoWidth || 120
      canvas.height = frameVideo.videoHeight || 90
      const ctx = canvas.getContext('2d')
      if (!ctx) return null
      ctx.drawImage(frameVideo, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL('image/png')
    },
    [dpRef]
  )

  // 🧩 用防抖函数包裹帧捕获，减少频繁调用
  const debouncedFetchFrame = useDebounce(async (time: number) => {
    const frameUrl = await captureFrame(time)
    if (frameUrl) {
      setUrl(frameUrl)
      setError(false)
      setLoaded(false)
    } else {
      setError(true)
      setLoaded(false)
    }
  }, 150) // 150ms防抖间隔，可根据体验调整

  useEffect(() => {
    if (!dpRef.current?.video || isDragging || !isFinite(hoverTime)) return
    debouncedFetchFrame(hoverTime)
  }, [hoverTime, debouncedFetchFrame, isDragging, dpRef])

  useEffect(() => {
    if (!isDragging) setThumbTranslate(containerWidth * progressTranslate)
  }, [progressTranslate, containerWidth, isDragging])

  const updateVideoTime = useCallback(
    (x: number) => {
      if (!mainVideo) return
      const clampedX = Math.max(0, Math.min(containerWidth, x))
      setThumbTranslate(clampedX)
      const ratio = clampedX / containerWidth
      mainVideo.currentTime = videoDuration * ratio
      setCurrentTime(videoDuration * ratio)
    },
    [containerWidth, setCurrentTime, videoDuration, mainVideo]
  )

  // 🧩 包装 mousemove 为节流版
  const handleMouseMove = useThrottle(
    (e: MouseEvent | React.MouseEvent) => {
      if (!containerRef.current || videoDuration <= 0) return
      const rect = containerRef.current.getBoundingClientRect()
      let x = e.clientX - rect.left
      x = Math.max(0, Math.min(containerWidth, x))
      setMoveIndicatorRaw(x)
      const calculatedHoverTime = videoDuration * (x / containerWidth)
      setHoverTime(isFinite(calculatedHoverTime) ? calculatedHoverTime : 0)
      if (isDragging) updateVideoTime(x)
    },
    33 // 节流间隔约30fps
  )

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    setIsDragging(true)
    handleMouseMove(e)
  }

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    handleMouseMove(e)
  }

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
  }, [isDragging, setIsDragging])

  const handleMouseLeave = () => setIsHover(false)

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={containerRef}
      className={'relative group/top flex pb-1.5 cursor-pointer items-end'}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHover(true)}
    >
      <div className={cn(base())}>
        <div className={cn(schedule())}>
          <div
            className={'bg-[hsla(0,0%,100%,.2)] rounded-[1.5px] inset-0 absolute overflow-hidden'}
          >
            <div
              style={{ transform: `scaleX(${Math.min(progressTranslate + 0.05, 1)})` }}
              className={'bg-[hsla(0,0%,100%,.3)] inset-0 absolute origin-[0_0]'}
            ></div>
            <div
              style={{ transform: `scaleX(${progressTranslate})` }}
              className={'bg-[#00a1d6] inset-0 absolute origin-[0_0]'}
            ></div>
          </div>
        </div>
        <div
          style={{ transform: `translateX(${Math.max(thumbTranslate - 3, 0)}px)` }}
          className={cn(thumb())}
        >
          <div
            className={cn(
              'size-full scale-0 transition-all duration-200 ',
              (isHover || isDragging) && 'scale-100'
            )}
          >
            <div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 18 18'
                width='18'
                height='18'
                preserveAspectRatio='xMidYMid meet'
                className={'size-full transform-[translate3d(0px,0px,0px)]'}
              >
                <defs>
                  <clipPath id='__lottie_element_55'>
                    <rect width='18' height='18' x='0' y='0'></rect>
                  </clipPath>
                </defs>
                <g clipPath='url(#__lottie_element_55)'>
                  <g
                    transform='matrix(0.9883429408073425,-0.7275781631469727,0.6775955557823181,0.920446515083313,7.3224687576293945,-0.7606706619262695)'
                    opacity='1'
                    className={'block'}
                  >
                    <g
                      opacity='1'
                      transform='matrix(0.9937776327133179,-0.11138220876455307,0.11138220876455307,0.9937776327133179,-2.5239999294281006,1.3849999904632568)'
                    >
                      <path
                        className={'fill-[rgb(51,51,51)]!'}
                        fill='rgb(51,51,51)'
                        fillOpacity='1'
                        d=' M0.75,-1.25 C0.75,-1.25 0.75,1.25 0.75,1.25 C0.75,1.663925051689148 0.4139249920845032,2 0,2 C0,2 0,2 0,2 C-0.4139249920845032,2 -0.75,1.663925051689148 -0.75,1.25 C-0.75,1.25 -0.75,-1.25 -0.75,-1.25 C-0.75,-1.663925051689148 -0.4139249920845032,-2 0,-2 C0,-2 0,-2 0,-2 C0.4139249920845032,-2 0.75,-1.663925051689148 0.75,-1.25z'
                      ></path>
                    </g>
                  </g>
                  <g
                    transform='matrix(1.1436611413955688,0.7535901665687561,-0.6317168474197388,0.9587040543556213,16.0070743560791,2.902894973754883)'
                    opacity='1'
                    className={'block'}
                  >
                    <g
                      opacity='1'
                      transform='matrix(0.992861807346344,0.1192704513669014,-0.1192704513669014,0.992861807346344,-2.5239999294281006,1.3849999904632568)'
                    >
                      <path
                        className={'fill-[rgb(51,51,51)]!'}
                        fill='rgb(51,51,51)'
                        fillOpacity='1'
                        d=' M0.75,-1.25 C0.75,-1.25 0.75,1.25 0.75,1.25 C0.75,1.663925051689148 0.4139249920845032,2 0,2 C0,2 0,2 0,2 C-0.4139249920845032,2 -0.75,1.663925051689148 -0.75,1.25 C-0.75,1.25 -0.75,-1.25 -0.75,-1.25 C-0.75,-1.663925051689148 -0.4139249920845032,-2 0,-2 C0,-2 0,-2 0,-2 C0.4139249920845032,-2 0.75,-1.663925051689148 0.75,-1.25z'
                      ></path>
                    </g>
                  </g>
                  <g
                    transform='matrix(1,0,0,1,8.890999794006348,8.406000137329102)'
                    opacity='1'
                    className={'block'}
                  >
                    <g
                      opacity='1'
                      transform='matrix(1,0,0,1,0.09099999815225601,1.1009999513626099)'
                    >
                      <path
                        fill='rgb(255,255,255)'
                        fillOpacity='1'
                        d=' M7,-3 C7,-3 7,3 7,3 C7,4.379749774932861 5.879749774932861,5.5 4.5,5.5 C4.5,5.5 -4.5,5.5 -4.5,5.5 C-5.879749774932861,5.5 -7,4.379749774932861 -7,3 C-7,3 -7,-3 -7,-3 C-7,-4.379749774932861 -5.879749774932861,-5.5 -4.5,-5.5 C-4.5,-5.5 4.5,-5.5 4.5,-5.5 C5.879749774932861,-5.5 7,-4.379749774932861 7,-3z'
                      ></path>
                      <path
                        strokeLinecap='butt'
                        strokeLinejoin='miter'
                        fillOpacity='0'
                        strokeMiterlimit='4'
                        stroke='rgb(51,51,51)'
                        strokeOpacity='1'
                        strokeWidth='1.5'
                        d=' M7,-3 C7,-3 7,3 7,3 C7,4.379749774932861 5.879749774932861,5.5 4.5,5.5 C4.5,5.5 -4.5,5.5 -4.5,5.5 C-5.879749774932861,5.5 -7,4.379749774932861 -7,3 C-7,3 -7,-3 -7,-3 C-7,-4.379749774932861 -5.879749774932861,-5.5 -4.5,-5.5 C-4.5,-5.5 4.5,-5.5 4.5,-5.5 C5.879749774932861,-5.5 7,-4.379749774932861 7,-3z'
                      ></path>
                    </g>
                  </g>
                  <g
                    transform='matrix(1,0,0,1,8.89900016784668,8.083999633789062)'
                    opacity='1'
                    className={'block'}
                  >
                    <g
                      opacity='1'
                      transform='matrix(1,0,0,1,-2.5239999294281006,1.3849999904632568)'
                    >
                      <path
                        className={'fill-[rgb(51,51,51)]!'}
                        fill='rgb(51,51,51)'
                        fillOpacity='1'
                        d=' M0.875,-1.125 C0.875,-1.125 0.875,1.125 0.875,1.125 C0.875,1.607912540435791 0.48291251063346863,2 0,2 C0,2 0,2 0,2 C-0.48291251063346863,2 -0.875,1.607912540435791 -0.875,1.125 C-0.875,1.125 -0.875,-1.125 -0.875,-1.125 C-0.875,-1.607912540435791 -0.48291251063346863,-2 0,-2 C0,-2 0,-2 0,-2 C0.48291251063346863,-2 0.875,-1.607912540435791 0.875,-1.125z'
                      ></path>
                    </g>
                  </g>
                  <g
                    transform='matrix(1,0,0,1,14.008999824523926,8.083999633789062)'
                    opacity='1'
                    className={'block'}
                  >
                    <g
                      opacity='1'
                      transform='matrix(1,0,0,1,-2.5239999294281006,1.3849999904632568)'
                    >
                      <path
                        className={'fill-[rgb(51,51,51)]!'}
                        fill='rgb(51,51,51)'
                        fillOpacity='1'
                        d=' M0.8999999761581421,-1.100000023841858 C0.8999999761581421,-1.100000023841858 0.8999999761581421,1.100000023841858 0.8999999761581421,1.100000023841858 C0.8999999761581421,1.596709966659546 0.4967099726200104,2 0,2 C0,2 0,2 0,2 C-0.4967099726200104,2 -0.8999999761581421,1.596709966659546 -0.8999999761581421,1.100000023841858 C-0.8999999761581421,1.100000023841858 -0.8999999761581421,-1.100000023841858 -0.8999999761581421,-1.100000023841858 C-0.8999999761581421,-1.596709966659546 -0.4967099726200104,-2 0,-2 C0,-2 0,-2 0,-2 C0.4967099726200104,-2 0.8999999761581421,-1.596709966659546 0.8999999761581421,-1.100000023841858z'
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div style={{ left: `${moveIndicatorRaw}px` }} className={cn(moveIndicator())}>
          <div
            className={
              'size-0 relative border-[4px_4px_0] border-[#00a1d6_transparent_transparent]'
            }
          />
          <div
            className={
              'size-0  relative border-[transparent_transparent_#00a1d6] border-[0_4px_4px] mt-2'
            }
          />
        </div>
        {containerRef.current && (
          <div
            style={{
              left: `${Math.min(
                Math.max(moveIndicatorRaw - 80, 0),
                containerRef.current.getBoundingClientRect().width - 160
              )}px`,
            }}
            className={cn(popup())}
          >
            <div className={'h-[90px] w-40 relative'}>
              {url && !loaded && !error && (
                <Image
                  src={url}
                  alt={'cover'}
                  fill
                  className={
                    'size-full relative mx-auto transition-[filter_.3s_ease] align-[inherit] '
                  }
                />
              )}
              <div
                className={
                  'bg-[hsla(0,0%,8%,.9)] rounded-[2px] bottom-0 text-white text-xs h-4.5 left-1/2 leading-4.5 px-[5px] absolute -translate-x-1/2 align-bottom'
                }
              >
                {formatTime(hoverTime)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoPlayerControllerTop
