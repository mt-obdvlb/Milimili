'use client'

import { tv } from 'tailwind-variants'
import { cn } from '@/lib'
import { Dispatch, RefObject, SetStateAction, useEffect, useMemo, useState } from 'react'
import DPlayer from 'dplayer'
import { formatTime } from '@/utils'
import { HoverCard, HoverCardTrigger, Input, Label } from '@/components'
import VideoPlayerControllerHoverContent from '@/features/video/components/video-play/VideoPlayerControllerHoverContent'
import { Slider } from '@/components/ui/slider'
import VideoPlayerControllerTop from '@/features/video/components/video-play/VideoPlayerControllerTop'

const parseTimeInput = (input: string): number | null => {
  input = input.trim()
  // 如果纯数字，直接当秒数
  if (/^\d+$/.test(input)) return parseInt(input, 10)

  // HH:mm:ss 或 mm:ss
  const parts = input.split(':').map(Number)
  if (parts.some(isNaN)) return null

  if (parts.length === 3) {
    // HH:mm:ss
    return parts[0]! * 3600 + parts[1]! * 60 + parts[2]!
  } else if (parts.length === 2) {
    // mm:ss
    return parts[0]! * 60 + parts[1]!
  }

  return null
}

const VideoPlayerController = ({
  isShowController,
  dpRef,
  paused,
  isFullScreen,
  setIsFullScreen,
  isWebFull,
  setIsWebFull,
  currentTime,
  isDragging,
  setIsDragging,
  setCurrentTime,
}: {
  isShowController: boolean
  dpRef: RefObject<DPlayer | null>
  dpContainerRef: RefObject<HTMLDivElement | null>
  paused: boolean
  isFullScreen: boolean
  setIsFullScreen: Dispatch<SetStateAction<boolean>>
  isWebFull: boolean
  setIsWebFull: Dispatch<SetStateAction<boolean>>
  currentTime: number
  isDragging: boolean
  setIsDragging: Dispatch<SetStateAction<boolean>>
  setCurrentTime: Dispatch<SetStateAction<number>>
}) => {
  const [inputTime, setInputTime] = useState(false)
  const [inputValue, setInputValue] = useState('0:00')
  const [speed, setSpeed] = useState(1.0)
  const [speedOpen, setSpeedOpen] = useState(false)
  const [volume, setVolume] = useState(75)
  const [volumeOpen, setVolumeOpen] = useState(false)

  useEffect(() => {
    const video = dpRef.current?.video
    if (!video) return
    setInputValue(formatTime(video.currentTime))
    const updateValue = () => setInputValue(formatTime(video.currentTime))
    video.addEventListener('timeupdate', updateValue)
    return () => video.removeEventListener('timeupdate', updateValue)
  }, [dpRef])

  const progressTranslate = useMemo(
    () => currentTime / (dpRef.current?.video.duration ?? currentTime),
    [currentTime, dpRef]
  )

  const handleBlur = () => {
    const video = dpRef.current?.video
    if (!video) return

    const seconds = parseTimeInput(inputValue)
    if (seconds !== null && seconds <= video.duration) {
      video.currentTime = seconds
      setInputValue(formatTime(seconds)) // 确保格式化后显示
    } else {
      // 输入不合法 → 回滚到视频当前时间
      setInputValue(formatTime(video.currentTime))
    }

    setInputTime(false)
  }

  const videoControllerStyles = tv({
    slots: {
      base: cn(isFullScreen && 'h-[73px] leading-[73px]'),
      top: cn(
        ' bottom-11 inset-x-0 absolute px-3 transition-opacity duration-200 ease-out',
        isShowController || isDragging ? 'opacity-100 visible' : 'opacity-0 hidden',
        isFullScreen && 'bottom-[68px]'
      ),
      bottom: cn(
        'flex justify-between h-[35px] box-border! transition-all duration-200 ease-out leading-[22px] mt-5 px-3   w-full',
        isShowController || isDragging ? 'opacity-100' : 'opacity-0',
        isFullScreen && 'h-[45px] leading-[34px] m-[20px_0_0]'
      ),
      progress: cn(
        'inset-x-0 absolute bottom-0 h-[2px] transition-opacity duration-400 ease-in',
        isShowController || isDragging ? 'opacity-0 hidden' : 'opacity-100 visible'
      ),
      pbp: cn(
        'bottom-[3px] cursor-pointer h-7 -left-3 leading-7  px-3 absolute w-[calc(100%+24px)] -z-1',
        isShowController || isDragging ? 'opacity-100 w-full bottom-full left-0' : 'opacity-0',
        isFullScreen && 'bottom-[calc(100%+7px)]'
      ),
      btn: cn(
        'fill-white hover:text-white  text-[hsla(0,0%,100%,.8)]  leading-[22px] h-[22px] outline-none relative text-center w-9 z-2',
        isFullScreen && 'h-[43px] leading-[32px] w-[54px]'
      ),
    },
  })

  const { top, pbp, bottom, progress, btn, base } = videoControllerStyles()

  return (
    <div className={cn(base())}>
      <div className={top()}>
        <VideoPlayerControllerTop
          setCurrentTime={setCurrentTime}
          setIsDragging={setIsDragging}
          isDragging={isDragging}
          dpRef={dpRef}
          currentTime={currentTime}
          progressTranslate={progressTranslate}
        />
      </div>

      <div style={{ boxSizing: 'border-box' }} className={bottom()}>
        <div className={cn('inline-flex', isFullScreen && 'min-w-[316px]')}>
          <div
            className={
              'fill-white hover:text-white text-[hsla(0,0%,100%,.8)]  leading-[22px] h-[22px] outline-none relative text-center w-9 z-2'
            }
          >
            <div
              className={
                'select-none w-full cursor-pointer inline-flex align-middle opacity-90 h-[22px]'
              }
              onClick={() => dpRef.current?.toggle()}
            >
              <span className={'size-full transition-[fill] duration-150 ease-in-out'}>
                {paused ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 28 28'
                    width='28'
                    height='28'
                    preserveAspectRatio='xMidYMid meet'
                    className={'size-full transform-[translate3d(0px,0px,0px)]'}
                  >
                    <defs>
                      <clipPath id='__lottie_element_234'>
                        <rect width='28' height='28' x='0' y='0'></rect>
                      </clipPath>
                    </defs>
                    <g clipPath='url(#__lottie_element_234)'>
                      <g
                        transform='matrix(0,0,0,0,19.437999725341797,14.125)'
                        opacity='7.512491548311573e-7'
                        className={'block'}
                      >
                        <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                          <path
                            fill='rgb(255,255,255)'
                            fillOpacity='1'
                            d=' M-5.484000205993652,-10 C-7.953000068664551,-10 -8,-7.984000205993652 -8,-7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 -8.008000373840332,7.984000205993652 C-8.008000373840332,7.984000205993652 -7.984000205993652,9.991999626159668 -5.5,9.991999626159668 C-3.0160000324249268,9.991999626159668 -3.003999948501587,7.995999813079834 -3.003999948501587,7.995999813079834 C-3.003999948501587,7.995999813079834 -2.9839999675750732,-8 -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,-10 -5.484000205993652,-10z'
                          ></path>
                          <path
                            strokeLinecap='butt'
                            strokeLinejoin='miter'
                            fillOpacity='0'
                            strokeMiterlimit='4'
                            stroke='rgb(255,255,255)'
                            strokeOpacity='1'
                            strokeWidth='0'
                            d=' M-5.484000205993652,-10 C-7.953000068664551,-10 -8,-7.984000205993652 -8,-7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 -8.008000373840332,7.984000205993652 C-8.008000373840332,7.984000205993652 -7.984000205993652,9.991999626159668 -5.5,9.991999626159668 C-3.0160000324249268,9.991999626159668 -3.003999948501587,7.995999813079834 -3.003999948501587,7.995999813079834 C-3.003999948501587,7.995999813079834 -2.9839999675750732,-8 -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,-10 -5.484000205993652,-10z'
                          ></path>
                        </g>
                      </g>
                      <g
                        transform='matrix(0.7189439535140991,0,0,0.7189439535140991,22.748554229736328,14)'
                        opacity='0.06308687687017198'
                        className={'hidden'}
                      >
                        <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                          <path
                            fill='rgb(255,255,255)'
                            fillOpacity='1'
                            d=' M-5.484000205993652,-10 C-7.953000068664551,-10 -8,-7.984000205993652 -8,-7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 -8.008000373840332,7.984000205993652 C-8.008000373840332,7.984000205993652 -7.984000205993652,9.991999626159668 -5.5,9.991999626159668 C-3.0160000324249268,9.991999626159668 -3.003999948501587,7.995999813079834 -3.003999948501587,7.995999813079834 C-3.003999948501587,7.995999813079834 -2.9839999675750732,-8 -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,-10 -5.484000205993652,-10z'
                          ></path>
                          <path
                            strokeLinecap='butt'
                            strokeLinejoin='miter'
                            fillOpacity='0'
                            strokeMiterlimit='4'
                            stroke='rgb(255,255,255)'
                            strokeOpacity='1'
                            strokeWidth='0'
                            d=' M-5.484000205993652,-10 C-7.953000068664551,-10 -8,-7.984000205993652 -8,-7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 -8.008000373840332,7.984000205993652 C-8.008000373840332,7.984000205993652 -7.984000205993652,9.991999626159668 -5.5,9.991999626159668 C-3.0160000324249268,9.991999626159668 -3.003999948501587,7.995999813079834 -3.003999948501587,7.995999813079834 C-3.003999948501587,7.995999813079834 -2.9839999675750732,-8 -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,-10 -5.484000205993652,-10z'
                          ></path>
                        </g>
                      </g>
                      <g className={'block'} transform='matrix(1,0,0,1,14,14)' opacity='1'>
                        <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                          <path fill='rgb(255,255,255)' fillOpacity='1' d='M0 0'></path>
                          <path
                            strokeLinecap='butt'
                            strokeLinejoin='miter'
                            fillOpacity='0'
                            strokeMiterlimit='4'
                            stroke='rgb(255,255,255)'
                            strokeOpacity='1'
                            strokeWidth='0'
                            d='M0 0'
                          ></path>
                        </g>
                        <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                          <path
                            fill='rgb(255,255,255)'
                            fillOpacity='1'
                            d=' M-7.031000137329102,-10.875 C-7.031000137329102,-10.875 -8.32800006866455,-11.25 -9.42199993133545,-10.468999862670898 C-10.109999656677246,-9.906999588012695 -10,-7.992000102996826 -10,-7.992000102996826 C-10,-7.992000102996826 -10,8.015999794006348 -10,8.015999794006348 C-10,8.015999794006348 -10.125,10.241999626159668 -9,10.991999626159668 C-7.875,11.741999626159668 -5,10.031000137329102 -5,10.031000137329102 C-5,10.031000137329102 7.968999862670898,1.875 7.968999862670898,1.875 C7.968999862670898,1.875 9,1.062000036239624 9,0 C9,-1.062000036239624 7.968999862670898,-1.937999963760376 7.968999862670898,-1.937999963760376 C7.968999862670898,-1.937999963760376 -7.031000137329102,-10.875 -7.031000137329102,-10.875z'
                          ></path>
                          <path
                            strokeLinecap='butt'
                            strokeLinejoin='miter'
                            fillOpacity='0'
                            strokeMiterlimit='4'
                            stroke='rgb(255,255,255)'
                            strokeOpacity='1'
                            strokeWidth='0'
                            d=' M-7.031000137329102,-10.875 C-7.031000137329102,-10.875 -8.32800006866455,-11.25 -9.42199993133545,-10.468999862670898 C-10.109999656677246,-9.906999588012695 -10,-7.992000102996826 -10,-7.992000102996826 C-10,-7.992000102996826 -10,8.015999794006348 -10,8.015999794006348 C-10,8.015999794006348 -10.125,10.241999626159668 -9,10.991999626159668 C-7.875,11.741999626159668 -5,10.031000137329102 -5,10.031000137329102 C-5,10.031000137329102 7.968999862670898,1.875 7.968999862670898,1.875 C7.968999862670898,1.875 9,1.062000036239624 9,0 C9,-1.062000036239624 7.968999862670898,-1.937999963760376 7.968999862670898,-1.937999963760376 C7.968999862670898,-1.937999963760376 -7.031000137329102,-10.875 -7.031000137329102,-10.875z'
                          ></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 28 28'
                    width='28'
                    height='28'
                    preserveAspectRatio='xMidYMid meet'
                    className={'size-full transform-[translate3d(0px,0px,0px)]'}
                  >
                    <defs>
                      <clipPath id='__lottie_element_465'>
                        <rect width='28' height='28' x='0' y='0'></rect>
                      </clipPath>
                    </defs>
                    <g clipPath='url(#__lottie_element_465)'>
                      <g transform='matrix(1,0,0,1,14,14)' opacity='1' className={'block'}>
                        <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                          <path
                            fill='rgb(255,255,255)'
                            fillOpacity='1'
                            d=' M-5.484000205993652,-10 C-7.953000068664551,-10 -8,-7.984000205993652 -8,-7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 -8.008000373840332,7.984000205993652 C-8.008000373840332,7.984000205993652 -7.984000205993652,9.991999626159668 -5.5,9.991999626159668 C-3.0160000324249268,9.991999626159668 -3.003999948501587,7.995999813079834 -3.003999948501587,7.995999813079834 C-3.003999948501587,7.995999813079834 -2.9839999675750732,-8 -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,-10 -5.484000205993652,-10z'
                          ></path>
                          <path
                            strokeLinecap='butt'
                            strokeLinejoin='miter'
                            fillOpacity='0'
                            strokeMiterlimit='4'
                            stroke='rgb(255,255,255)'
                            strokeOpacity='1'
                            strokeWidth='0'
                            d=' M-5.484000205993652,-10 C-7.953000068664551,-10 -8,-7.984000205993652 -8,-7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 -8.008000373840332,7.984000205993652 C-8.008000373840332,7.984000205993652 -7.984000205993652,9.991999626159668 -5.5,9.991999626159668 C-3.0160000324249268,9.991999626159668 -3.003999948501587,7.995999813079834 -3.003999948501587,7.995999813079834 C-3.003999948501587,7.995999813079834 -2.9839999675750732,-8 -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,-10 -5.484000205993652,-10z'
                          ></path>
                        </g>
                      </g>
                      <g
                        className={'block'}
                        transform='matrix(1,0,0,1,24.812000274658203,14)'
                        opacity='1'
                      >
                        <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                          <path
                            fill='rgb(255,255,255)'
                            fillOpacity='1'
                            d=' M-5.484000205993652,-10 C-7.953000068664551,-10 -8,-7.984000205993652 -8,-7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 -8.008000373840332,7.984000205993652 C-8.008000373840332,7.984000205993652 -7.984000205993652,9.991999626159668 -5.5,9.991999626159668 C-3.0160000324249268,9.991999626159668 -3.003999948501587,7.995999813079834 -3.003999948501587,7.995999813079834 C-3.003999948501587,7.995999813079834 -2.9839999675750732,-8 -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,-10 -5.484000205993652,-10z'
                          ></path>
                          <path
                            strokeLinecap='butt'
                            strokeLinejoin='miter'
                            fillOpacity='0'
                            strokeMiterlimit='4'
                            stroke='rgb(255,255,255)'
                            strokeOpacity='1'
                            strokeWidth='0'
                            d=' M-5.484000205993652,-10 C-7.953000068664551,-10 -8,-7.984000205993652 -8,-7.984000205993652 C-8,-7.984000205993652 -8.008000373840332,7.984000205993652 -8.008000373840332,7.984000205993652 C-8.008000373840332,7.984000205993652 -7.984000205993652,9.991999626159668 -5.5,9.991999626159668 C-3.0160000324249268,9.991999626159668 -3.003999948501587,7.995999813079834 -3.003999948501587,7.995999813079834 C-3.003999948501587,7.995999813079834 -2.9839999675750732,-8 -2.9839999675750732,-8 C-2.9839999675750732,-8 -3.015000104904175,-10 -5.484000205993652,-10z'
                          ></path>
                        </g>
                      </g>
                      <g
                        transform='matrix(1,0,0,1,4,14)'
                        opacity='4.896020439559834e-7'
                        className={'block'}
                      >
                        <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                          <path fill='rgb(255,255,255)' fillOpacity='1' d='M0 0'></path>
                          <path
                            strokeLinecap='butt'
                            strokeLinejoin='miter'
                            fillOpacity='0'
                            strokeMiterlimit='4'
                            stroke='rgb(255,255,255)'
                            strokeOpacity='1'
                            strokeWidth='0'
                            d='M0 0'
                          ></path>
                        </g>
                        <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                          <path
                            fill='rgb(255,255,255)'
                            fillOpacity='1'
                            d=' M-7.031000137329102,-10.875 C-7.031000137329102,-10.875 -8.32800006866455,-11.25 -9.42199993133545,-10.468999862670898 C-10.109999656677246,-9.906999588012695 -10,-7.992000102996826 -10,-7.992000102996826 C-10,-7.992000102996826 -10,8.015999794006348 -10,8.015999794006348 C-10,8.015999794006348 -10.125,10.241999626159668 -9,10.991999626159668 C-7.875,11.741999626159668 -5,10.031000137329102 -5,10.031000137329102 C-5,10.031000137329102 7.968999862670898,1.875 7.968999862670898,1.875 C7.968999862670898,1.875 9,1.062000036239624 9,0 C9,-1.062000036239624 7.968999862670898,-1.937999963760376 7.968999862670898,-1.937999963760376 C7.968999862670898,-1.937999963760376 -7.031000137329102,-10.875 -7.031000137329102,-10.875z'
                          ></path>
                          <path
                            strokeLinecap='butt'
                            strokeLinejoin='miter'
                            fillOpacity='0'
                            strokeMiterlimit='4'
                            stroke='rgb(255,255,255)'
                            strokeOpacity='1'
                            strokeWidth='0'
                            d=' M-7.031000137329102,-10.875 C-7.031000137329102,-10.875 -8.32800006866455,-11.25 -9.42199993133545,-10.468999862670898 C-10.109999656677246,-9.906999588012695 -10,-7.992000102996826 -10,-7.992000102996826 C-10,-7.992000102996826 -10,8.015999794006348 -10,8.015999794006348 C-10,8.015999794006348 -10.125,10.241999626159668 -9,10.991999626159668 C-7.875,11.741999626159668 -5,10.031000137329102 -5,10.031000137329102 C-5,10.031000137329102 7.968999862670898,1.875 7.968999862670898,1.875 C7.968999862670898,1.875 9,1.062000036239624 9,0 C9,-1.062000036239624 7.968999862670898,-1.937999963760376 7.968999862670898,-1.937999963760376 C7.968999862670898,-1.937999963760376 -7.031000137329102,-10.875 -7.031000137329102,-10.875z'
                          ></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                )}
              </span>
            </div>
          </div>
          <Label
            className={
              'text-xs hover:text-white pointer-events-auto mr-2.5 min-w-[90px] fill-white text-[hsla(0,_0%,_100%,_.8)]  leading-[22px] h-[22px] outline-none relative text-center w-9 z-2'
            }
            onClick={() => setInputTime(true)}
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleBlur()
                }
              }}
              className={cn(
                ' bg-[hsla(0,0%,100%,.2)] border border-transparent text-inherit text-xs h-5 left-1.5 leading-5 px-[5px] absolute text-center top-0 w-15',
                !inputTime && 'hidden'
              )}
            />
            <div
              className={cn(
                'size-full cursor-text absolute text-center whitespace-nowrap',
                inputTime && 'hidden'
              )}
            >
              <span className={'text-center'}>{formatTime(currentTime ?? 0)}</span>
              <span className={'px-[2px] text-center'}>/</span>
              <span className={'text-center'}>
                {formatTime(dpRef.current?.video.duration ?? 0)}
              </span>
            </div>
          </Label>
        </div>
        <div className={cn(isFullScreen && 'grow px-15 leading-[34px] h-[34px] flex-1')}></div>
        <div className={cn('flex justify-end', isFullScreen && 'min-w-[370px]')}>
          <HoverCard open={speedOpen} onOpenChange={setSpeedOpen} openDelay={50}>
            <HoverCardTrigger asChild>
              <div className={cn(btn(), 'text-sm w-[50px]')}>
                <div
                  className={cn('cursor-pointer  font-[600] whitespace-nowrap w-full')}
                  onClick={() => setSpeedOpen(true)}
                >
                  {speed === 1.0 ? '倍速' : `${speed}x`}
                </div>
              </div>
            </HoverCardTrigger>
            <VideoPlayerControllerHoverContent className={cn(' w-[70px] ')}>
              {[0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0].reverse().map((item) => (
                <div
                  onClick={() => {
                    setSpeed(item)
                    dpRef.current?.speed(item)
                    setSpeedOpen(false)
                  }}
                  key={item}
                  className={cn(
                    'cursor-pointer hover:bg-[hsla(0,0%,100%,.1)] h-9 leading-9 relative',
                    speed === item && 'text-brand_blue'
                  )}
                >{`${item}x`}</div>
              ))}
            </VideoPlayerControllerHoverContent>
          </HoverCard>

          <HoverCard open={volumeOpen} onOpenChange={setVolumeOpen} openDelay={50}>
            <HoverCardTrigger asChild>
              <div className={cn(btn())}>
                <div onClick={() => setVolumeOpen(true)} className={cn('cursor-pointer w-full')}>
                  <span className={cn('h-[22px] opacity-90 inline-flex select-none w-full')}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 88 88'
                      width='88'
                      height='88'
                      preserveAspectRatio='xMidYMid meet'
                      className={'size-full'}
                    >
                      <defs>
                        <clipPath id='__lottie_element_94'>
                          <rect width='88' height='88' x='0' y='0'></rect>
                        </clipPath>
                        <clipPath id='__lottie_element_96'>
                          <path d='M0,0 L88,0 L88,88 L0,88z'></path>
                        </clipPath>
                      </defs>
                      <g clipPath='url(#__lottie_element_94)'>
                        <g
                          clipPath='url(#__lottie_element_96)'
                          transform='matrix(1,0,0,1,0,0)'
                          opacity='1'
                          className={'block'}
                        >
                          <g transform='matrix(1,0,0,1,28,44)' opacity='1' className={'block'}>
                            <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                              <path
                                fill='rgb(255,255,255)'
                                fillOpacity='1'
                                d=' M15.5600004196167,-25.089000701904297 C15.850000381469727,-24.729000091552734 16,-24.288999557495117 16,-23.839000701904297 C16,-23.839000701904297 16,23.840999603271484 16,23.840999603271484 C16,24.94099998474121 15.100000381469727,25.840999603271484 14,25.840999603271484 C13.550000190734863,25.840999603271484 13.109999656677246,25.680999755859375 12.75,25.400999069213867 C12.75,25.400999069213867 -4,12.00100040435791 -4,12.00100040435791 C-4,12.00100040435791 -8,12.00100040435791 -8,12.00100040435791 C-12.420000076293945,12.00100040435791 -16,8.420999526977539 -16,4.000999927520752 C-16,4.000999927520752 -16,-3.999000072479248 -16,-3.999000072479248 C-16,-8.418999671936035 -12.420000076293945,-11.99899959564209 -8,-11.99899959564209 C-8,-11.99899959564209 -4,-11.99899959564209 -4,-11.99899959564209 C-4,-11.99899959564209 12.75,-25.39900016784668 12.75,-25.39900016784668 C13.609999656677246,-26.089000701904297 14.869999885559082,-25.948999404907227 15.5600004196167,-25.089000701904297z'
                              ></path>
                            </g>
                          </g>
                          <g
                            className={'block'}
                            transform='matrix(1.0054609775543213,0,0,1.0054609775543213,56.00586700439453,44.0004997253418)'
                            opacity='0.03713775007686365'
                          >
                            <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                              <path
                                fill='rgb(255,255,255)'
                                fillOpacity='1'
                                d=' M-4,-13.859000205993652 C0.7799999713897705,-11.08899974822998 4,-5.919000148773193 4,0.0010000000474974513 C4,5.921000003814697 0.7799999713897705,11.090999603271484 -4,13.861000061035156 C-4,13.861000061035156 -4,-13.859000205993652 -4,-13.859000205993652z'
                              ></path>
                            </g>
                          </g>
                          <g
                            className={'block'}
                            transform='matrix(1.0126574039459229,0,0,1.0126574039459229,64.37825012207031,44.0057487487793)'
                            opacity='0.016538625464352065'
                          >
                            <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                              <path
                                fill='rgb(255,255,255)'
                                fillOpacity='1'
                                d=' M-6.236000061035156,-28.895999908447266 C4.803999900817871,-23.615999221801758 11.984000205993652,-12.456000328063965 11.984000205993652,-0.006000000052154064 C11.984000205993652,12.454000473022461 4.794000148773193,23.624000549316406 -6.265999794006348,28.893999099731445 C-8.255999565124512,29.8439998626709 -10.645999908447266,29.003999710083008 -11.595999717712402,27.003999710083008 C-12.545999526977539,25.013999938964844 -11.696000099182129,22.624000549316406 -9.706000328063965,21.673999786376953 C-1.406000018119812,17.724000930786133 3.9839999675750732,9.343999862670898 3.9839999675750732,-0.006000000052154064 C3.9839999675750732,-9.345999717712402 -1.3960000276565552,-17.715999603271484 -9.675999641418457,-21.676000595092773 C-11.675999641418457,-22.625999450683594 -12.515999794006348,-25.016000747680664 -11.565999984741211,-27.006000518798828 C-10.616000175476074,-29.006000518798828 -8.22599983215332,-29.84600067138672 -6.236000061035156,-28.895999908447266z'
                              ></path>
                            </g>
                          </g>
                          <g
                            className={'block'}
                            transform='matrix(1.0002113580703735,0,0,1.0002113580703735,56.00299835205078,44)'
                            opacity='1'
                          >
                            <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                              <path
                                fill='rgb(255,255,255)'
                                fillOpacity='1'
                                d=' M-4,-13.859000205993652 C0.7799999713897705,-11.08899974822998 4,-5.919000148773193 4,0.0010000000474974513 C4,5.921000003814697 0.7799999713897705,11.090999603271484 -4,13.861000061035156 C-4,13.861000061035156 -4,-13.859000205993652 -4,-13.859000205993652z'
                              ></path>
                            </g>
                          </g>
                          <g
                            className={'block'}
                            transform='matrix(1.0002062320709229,0,0,1.0002062320709229,64.00399780273438,44.00699996948242)'
                            opacity='1'
                          >
                            <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                              <path
                                fill='rgb(255,255,255)'
                                fillOpacity='1'
                                d=' M-6.236000061035156,-28.895999908447266 C4.803999900817871,-23.615999221801758 11.984000205993652,-12.456000328063965 11.984000205993652,-0.006000000052154064 C11.984000205993652,12.454000473022461 4.794000148773193,23.624000549316406 -6.265999794006348,28.893999099731445 C-8.255999565124512,29.8439998626709 -10.645999908447266,29.003999710083008 -11.595999717712402,27.003999710083008 C-12.545999526977539,25.013999938964844 -11.696000099182129,22.624000549316406 -9.706000328063965,21.673999786376953 C-1.406000018119812,17.724000930786133 3.9839999675750732,9.343999862670898 3.9839999675750732,-0.006000000052154064 C3.9839999675750732,-9.345999717712402 -1.3960000276565552,-17.715999603271484 -9.675999641418457,-21.676000595092773 C-11.675999641418457,-22.625999450683594 -12.515999794006348,-25.016000747680664 -11.565999984741211,-27.006000518798828 C-10.616000175476074,-29.006000518798828 -8.22599983215332,-29.84600067138672 -6.236000061035156,-28.895999908447266z'
                              ></path>
                            </g>
                          </g>
                          <g className={'block'} transform='matrix(1,0,0,1,56,44)' opacity='1'>
                            <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                              <path
                                fill='rgb(255,255,255)'
                                fillOpacity='1'
                                d=' M-4,-13.859000205993652 C0.7799999713897705,-11.08899974822998 4,-5.919000148773193 4,0.0010000000474974513 C4,5.921000003814697 0.7799999713897705,11.090999603271484 -4,13.861000061035156 C-4,13.861000061035156 -4,-13.859000205993652 -4,-13.859000205993652z'
                              ></path>
                            </g>
                          </g>
                          <g
                            transform='matrix(1,0,0,1,64.01399993896484,44.00699996948242)'
                            opacity='1'
                            className={'block'}
                          >
                            <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                              <path
                                fill='rgb(255,255,255)'
                                fillOpacity='1'
                                d=' M-6.236000061035156,-28.895999908447266 C4.803999900817871,-23.615999221801758 11.984000205993652,-12.456000328063965 11.984000205993652,-0.006000000052154064 C11.984000205993652,12.454000473022461 4.794000148773193,23.624000549316406 -6.265999794006348,28.893999099731445 C-8.255999565124512,29.8439998626709 -10.645999908447266,29.003999710083008 -11.595999717712402,27.003999710083008 C-12.545999526977539,25.013999938964844 -11.696000099182129,22.624000549316406 -9.706000328063965,21.673999786376953 C-1.406000018119812,17.724000930786133 3.9839999675750732,9.343999862670898 3.9839999675750732,-0.006000000052154064 C3.9839999675750732,-9.345999717712402 -1.3960000276565552,-17.715999603271484 -9.675999641418457,-21.676000595092773 C-11.675999641418457,-22.625999450683594 -12.515999794006348,-25.016000747680664 -11.565999984741211,-27.006000518798828 C-10.616000175476074,-29.006000518798828 -8.22599983215332,-29.84600067138672 -6.236000061035156,-28.895999908447266z'
                              ></path>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>
            </HoverCardTrigger>
            <VideoPlayerControllerHoverContent className={cn('h-25 w-8 rounded-[2px] ')}>
              <div
                className={cn('text-[#e5e9ef] text-xs leading-7 h-7 mb-[2px] text-center w-full')}
              >
                {volume}
              </div>
              <div className={cn('h-15 mx-auto cursor-pointer')}>
                <Slider
                  value={[volume]}
                  max={100}
                  min={0}
                  onValueChange={(value) => setVolume(value[0] ?? 0)}
                  onValueCommit={(value) => {
                    const v = value[0]
                    if (v === undefined) return
                    dpRef.current?.volume(v / 100, true, true)
                  }}
                  orientation={'vertical'}
                />
              </div>
            </VideoPlayerControllerHoverContent>
          </HoverCard>

          <HoverCard openDelay={50}>
            <HoverCardTrigger asChild>
              <div className={cn(btn())}>
                <div
                  onClick={() => {
                    if (isWebFull) {
                      setIsWebFull(false)
                      dpRef.current?.fullScreen.cancel('web')
                    } else {
                      setIsWebFull(true)
                      dpRef.current?.fullScreen.request('web')
                    }
                  }}
                  className={cn('cursor-pointer w-full')}
                >
                  <span className={cn('h-[22px] opacity-90 select-none w-full inline-flex ')}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 88 88'
                      width='88'
                      height='88'
                      preserveAspectRatio='xMidYMid meet'
                      className={cn('size-full')}
                    >
                      <defs>
                        <clipPath id='__lottie_element_172'>
                          <rect width='88' height='88' x='0' y='0'></rect>
                        </clipPath>
                      </defs>
                      <g clipPath='url(#__lottie_element_172)'>
                        <g transform='matrix(1,0,0,1,44,44)' opacity='1' className={cn('block')}>
                          <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                            <path
                              fill='rgb(255,255,255)'
                              fillOpacity='1'
                              d=' M-14,-20 C-14,-20 -26,-20 -26,-20 C-27.049999237060547,-20 -27.920000076293945,-19.18000030517578 -27.989999771118164,-18.149999618530273 C-27.989999771118164,-18.149999618530273 -28,-18 -28,-18 C-28,-18 -28,-6 -28,-6 C-28,-4.949999809265137 -27.18000030517578,-4.079999923706055 -26.149999618530273,-4.010000228881836 C-26.149999618530273,-4.010000228881836 -26,-4 -26,-4 C-26,-4 -22,-4 -22,-4 C-20.950000762939453,-4 -20.079999923706055,-4.820000171661377 -20.010000228881836,-5.849999904632568 C-20.010000228881836,-5.849999904632568 -20,-6 -20,-6 C-20,-6 -20,-12 -20,-12 C-20,-12 -14,-12 -14,-12 C-12.949999809265137,-12 -12.079999923706055,-12.819999694824219 -12.010000228881836,-13.850000381469727 C-12.010000228881836,-13.850000381469727 -12,-14 -12,-14 C-12,-14 -12,-18 -12,-18 C-12,-19.049999237060547 -12.819999694824219,-19.920000076293945 -13.850000381469727,-19.989999771118164 C-13.850000381469727,-19.989999771118164 -14,-20 -14,-20z M26,-20 C26,-20 14,-20 14,-20 C12.949999809265137,-20 12.079999923706055,-19.18000030517578 12.010000228881836,-18.149999618530273 C12.010000228881836,-18.149999618530273 12,-18 12,-18 C12,-18 12,-14 12,-14 C12,-12.949999809265137 12.819999694824219,-12.079999923706055 13.850000381469727,-12.010000228881836 C13.850000381469727,-12.010000228881836 14,-12 14,-12 C14,-12 20,-12 20,-12 C20,-12 20,-6 20,-6 C20,-4.949999809265137 20.81999969482422,-4.079999923706055 21.850000381469727,-4.010000228881836 C21.850000381469727,-4.010000228881836 22,-4 22,-4 C22,-4 26,-4 26,-4 C27.049999237060547,-4 27.920000076293945,-4.820000171661377 27.989999771118164,-5.849999904632568 C27.989999771118164,-5.849999904632568 28,-6 28,-6 C28,-6 28,-18 28,-18 C28,-19.049999237060547 27.18000030517578,-19.920000076293945 26.149999618530273,-19.989999771118164 C26.149999618530273,-19.989999771118164 26,-20 26,-20z M-22,4 C-22,4 -26,4 -26,4 C-27.049999237060547,4 -27.920000076293945,4.820000171661377 -27.989999771118164,5.849999904632568 C-27.989999771118164,5.849999904632568 -28,6 -28,6 C-28,6 -28,18 -28,18 C-28,19.049999237060547 -27.18000030517578,19.920000076293945 -26.149999618530273,19.989999771118164 C-26.149999618530273,19.989999771118164 -26,20 -26,20 C-26,20 -14,20 -14,20 C-12.949999809265137,20 -12.079999923706055,19.18000030517578 -12.010000228881836,18.149999618530273 C-12.010000228881836,18.149999618530273 -12,18 -12,18 C-12,18 -12,14 -12,14 C-12,12.949999809265137 -12.819999694824219,12.079999923706055 -13.850000381469727,12.010000228881836 C-13.850000381469727,12.010000228881836 -14,12 -14,12 C-14,12 -20,12 -20,12 C-20,12 -20,6 -20,6 C-20,4.949999809265137 -20.81999969482422,4.079999923706055 -21.850000381469727,4.010000228881836 C-21.850000381469727,4.010000228881836 -22,4 -22,4z M26,4 C26,4 22,4 22,4 C20.950000762939453,4 20.079999923706055,4.820000171661377 20.010000228881836,5.849999904632568 C20.010000228881836,5.849999904632568 20,6 20,6 C20,6 20,12 20,12 C20,12 14,12 14,12 C12.949999809265137,12 12.079999923706055,12.819999694824219 12.010000228881836,13.850000381469727 C12.010000228881836,13.850000381469727 12,14 12,14 C12,14 12,18 12,18 C12,19.049999237060547 12.819999694824219,19.920000076293945 13.850000381469727,19.989999771118164 C13.850000381469727,19.989999771118164 14,20 14,20 C14,20 26,20 26,20 C27.049999237060547,20 27.920000076293945,19.18000030517578 27.989999771118164,18.149999618530273 C27.989999771118164,18.149999618530273 28,18 28,18 C28,18 28,6 28,6 C28,4.949999809265137 27.18000030517578,4.079999923706055 26.149999618530273,4.010000228881836 C26.149999618530273,4.010000228881836 26,4 26,4z M28,-28 C32.41999816894531,-28 36,-24.420000076293945 36,-20 C36,-20 36,20 36,20 C36,24.420000076293945 32.41999816894531,28 28,28 C28,28 -28,28 -28,28 C-32.41999816894531,28 -36,24.420000076293945 -36,20 C-36,20 -36,-20 -36,-20 C-36,-24.420000076293945 -32.41999816894531,-28 -28,-28 C-28,-28 28,-28 28,-28z'
                            ></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>
            </HoverCardTrigger>
            <VideoPlayerControllerHoverContent className={''}>
              <div className={cn('flex items-center justify-center text-xs px-2 py-1')}>
                {isWebFull ? '退出网页全屏' : '网页全屏'}
              </div>
            </VideoPlayerControllerHoverContent>
          </HoverCard>

          <HoverCard openDelay={50}>
            <HoverCardTrigger asChild>
              <div className={cn(btn())}>
                <div
                  className={cn('w-full cursor-pointer')}
                  onClick={() => {
                    if (isFullScreen) {
                      dpRef.current?.fullScreen.cancel('browser')
                      setIsFullScreen(false)
                    } else {
                      dpRef.current?.fullScreen.request('browser')
                      setIsFullScreen(true)
                    }
                  }}
                >
                  <span
                    className={cn(
                      'opacity-100   h-[22px] items-start justify-center inline-flex select-none w-full '
                    )}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 88 88'
                      width='88'
                      height='88'
                      preserveAspectRatio='xMidYMid meet'
                      className={cn('size-full')}
                    >
                      <defs>
                        <clipPath id='__lottie_element_182'>
                          <rect width='88' height='88' x='0' y='0'></rect>
                        </clipPath>
                      </defs>
                      <g clipPath='url(#__lottie_element_182)'>
                        <g
                          transform='matrix(1,0,0,1,44,74.22000122070312)'
                          opacity='1'
                          className={'block'}
                        >
                          <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                            <path
                              fill='rgb(255,255,255)'
                              fillOpacity='1'
                              d=' M19.219999313354492,0.2199999988079071 C7.480000019073486,7.630000114440918 -7.480000019073486,7.630000114440918 -19.219999313354492,0.2199999988079071 C-19.219999313354492,0.2199999988079071 -16.219999313354492,-5.78000020980835 -16.219999313354492,-5.78000020980835 C-6.389999866485596,0.75 6.409999847412109,0.75 16.239999771118164,-5.78000020980835 C16.239999771118164,-5.78000020980835 19.219999313354492,0.2199999988079071 19.219999313354492,0.2199999988079071z'
                            ></path>
                          </g>
                        </g>
                        <g
                          transform='matrix(1,0,0,1,68.58000183105469,27.895000457763672)'
                          opacity='1'
                          className={'block'}
                        >
                          <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                            <path
                              fill='rgb(255,255,255)'
                              fillOpacity='1'
                              d=' M11.420000076293945,16.104999542236328 C11.420000076293945,16.104999542236328 4.78000020980835,16.104999542236328 4.78000020980835,16.104999542236328 C4.78000020980835,16.104999542236328 4.78000020980835,14.635000228881836 4.78000020980835,14.635000228881836 C4.25,4.054999828338623 -1.940000057220459,-5.425000190734863 -11.420000076293945,-10.164999961853027 C-11.420000076293945,-10.164999961853027 -8.479999542236328,-16.104999542236328 -8.479999542236328,-16.104999542236328 C3.7200000286102295,-10.005000114440918 11.420000076293945,2.4649999141693115 11.420000076293945,16.104999542236328 C11.420000076293945,16.104999542236328 11.420000076293945,16.104999542236328 11.420000076293945,16.104999542236328z'
                            ></path>
                          </g>
                        </g>
                        <g
                          transform='matrix(1,0,0,1,19.450000762939453,27.895000457763672)'
                          opacity='1'
                          className={'block'}
                        >
                          <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                            <path
                              fill='rgb(255,255,255)'
                              fillOpacity='1'
                              d=' M-4.809999942779541,16.104999542236328 C-4.809999942779541,16.104999542236328 -11.449999809265137,16.104999542236328 -11.449999809265137,16.104999542236328 C-11.449999809265137,2.4649999141693115 -3.75,-10.005000114440918 8.449999809265137,-16.104999542236328 C8.449999809265137,-16.104999542236328 11.449999809265137,-10.164999961853027 11.449999809265137,-10.164999961853027 C1.4900000095367432,-5.204999923706055 -4.809999942779541,4.974999904632568 -4.809999942779541,16.104999542236328 C-4.809999942779541,16.104999542236328 -4.809999942779541,16.104999542236328 -4.809999942779541,16.104999542236328z'
                            ></path>
                          </g>
                        </g>
                        <g
                          transform='matrix(1,0,0,1,44.0099983215332,65.96499633789062)'
                          opacity='1'
                          className={'block'}
                        >
                          <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                            <path
                              fill='rgb(255,255,255)'
                              fillOpacity='1'
                              d=' M-0.009999999776482582,5.34499979019165 C-5.46999979019165,5.355000019073486 -10.800000190734863,3.7149999141693115 -15.319999694824219,0.6549999713897705 C-15.319999694824219,0.6549999713897705 -12.319999694824219,-5.34499979019165 -12.319999694824219,-5.34499979019165 C-5,0.08500000089406967 5,0.08500000089406967 12.319999694824219,-5.34499979019165 C12.319999694824219,-5.34499979019165 15.319999694824219,0.6549999713897705 15.319999694824219,0.6549999713897705 C10.800000190734863,3.7249999046325684 5.460000038146973,5.355000019073486 -0.009999999776482582,5.34499979019165z'
                            ></path>
                          </g>
                        </g>
                        <g
                          transform='matrix(1,0,0,1,62.275001525878906,31.780000686645508)'
                          opacity='1'
                          className={'block'}
                        >
                          <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                            <path
                              fill='rgb(255,255,255)'
                              fillOpacity='1'
                              d=' M9.015000343322754,10.850000381469727 C9.015000343322754,10.850000381469727 9.015000343322754,12.220000267028809 9.015000343322754,12.220000267028809 C9.015000343322754,12.220000267028809 2.434999942779541,12.220000267028809 2.434999942779541,12.220000267028809 C2.434999942779541,12.220000267028809 2.434999942779541,11.220000267028809 2.434999942779541,11.220000267028809 C2.075000047683716,3.740000009536743 -2.305000066757202,-2.9700000286102295 -9.015000343322754,-6.309999942779541 C-9.015000343322754,-6.309999942779541 -6.014999866485596,-12.220000267028809 -6.014999866485596,-12.220000267028809 C-6.014999866485596,-12.220000267028809 -6.014999866485596,-12.220000267028809 -6.014999866485596,-12.220000267028809 C2.7850000858306885,-7.800000190734863 8.524999618530273,1.0099999904632568 9.015000343322754,10.850000381469727 C9.015000343322754,10.850000381469727 9.015000343322754,10.850000381469727 9.015000343322754,10.850000381469727z'
                            ></path>
                          </g>
                        </g>
                        <g
                          transform='matrix(1,0,0,1,25.729999542236328,31.780000686645508)'
                          opacity='1'
                          className={'block'}
                        >
                          <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                            <path
                              fill='rgb(255,255,255)'
                              fillOpacity='1'
                              d=' M-2.440000057220459,12.220000267028809 C-2.440000057220459,12.220000267028809 -9.050000190734863,12.220000267028809 -9.050000190734863,12.220000267028809 C-9.050000190734863,1.8700000047683716 -3.2100000381469727,-7.590000152587891 6.050000190734863,-12.220000267028809 C6.050000190734863,-12.220000267028809 9.050000190734863,-6.309999942779541 9.050000190734863,-6.309999942779541 C2.0199999809265137,-2.809999942779541 -2.430000066757202,4.360000133514404 -2.440000057220459,12.220000267028809 C-2.440000057220459,12.220000267028809 -2.440000057220459,12.220000267028809 -2.440000057220459,12.220000267028809z'
                            ></path>
                          </g>
                        </g>
                        <g
                          transform='matrix(1,0,0,1,44,57.654998779296875)'
                          opacity='1'
                          className={'block'}
                        >
                          <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                            <path
                              fill='rgb(255,255,255)'
                              fillOpacity='1'
                              d=' M0,4.974999904632568 C-4.110000133514404,4.994999885559082 -8.119999885559082,3.6449999809265137 -11.380000114440918,1.1349999904632568 C-11.380000114440918,1.1349999904632568 -8.319999694824219,-4.974999904632568 -8.319999694824219,-4.974999904632568 C-3.6700000762939453,-0.5049999952316284 3.6700000762939453,-0.5049999952316284 8.319999694824219,-4.974999904632568 C8.319999694824219,-4.974999904632568 11.380000114440918,1.1349999904632568 11.380000114440918,1.1349999904632568 C8.109999656677246,3.634999990463257 4.110000133514404,4.985000133514404 0,4.974999904632568 C0,4.974999904632568 0,4.974999904632568 0,4.974999904632568z'
                            ></path>
                          </g>
                        </g>
                        <g
                          transform='matrix(1,0,0,1,55.9900016784668,35.665000915527344)'
                          opacity='1'
                          className={'block'}
                        >
                          <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                            <path
                              fill='rgb(255,255,255)'
                              fillOpacity='1'
                              d=' M6.619999885559082,7.40500020980835 C6.619999885559082,7.40500020980835 6.619999885559082,8.335000038146973 6.619999885559082,8.335000038146973 C6.619999885559082,8.335000038146973 0.009999999776482582,8.335000038146973 0.009999999776482582,8.335000038146973 C0.009999999776482582,3.7850000858306885 -2.549999952316284,-0.375 -6.619999885559082,-2.4049999713897705 C-6.619999885559082,-2.4049999713897705 -3.619999885559082,-8.335000038146973 -3.619999885559082,-8.335000038146973 C2.380000114440918,-5.324999809265137 6.300000190734863,0.6949999928474426 6.619999885559082,7.40500020980835 C6.619999885559082,7.40500020980835 6.619999885559082,7.40500020980835 6.619999885559082,7.40500020980835z'
                            ></path>
                          </g>
                        </g>
                        <g
                          transform='matrix(1,0,0,1,31.9950008392334,35.665000915527344)'
                          opacity='1'
                          className={'block'}
                        >
                          <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                            <path
                              fill='rgb(255,255,255)'
                              fillOpacity='1'
                              d=' M6.635000228881836,-2.4049999713897705 C2.565000057220459,-0.375 0.004999999888241291,3.7850000858306885 0.004999999888241291,8.335000038146973 C0.004999999888241291,8.335000038146973 -6.635000228881836,8.335000038146973 -6.635000228881836,8.335000038146973 C-6.635000228881836,1.274999976158142 -2.6449999809265137,-5.184999942779541 3.674999952316284,-8.335000038146973 C3.674999952316284,-8.335000038146973 6.635000228881836,-2.4049999713897705 6.635000228881836,-2.4049999713897705z'
                            ></path>
                          </g>
                        </g>
                        <g
                          transform='matrix(1,0,0,1,44,66.322998046875)'
                          opacity='1'
                          className={'block'}
                        >
                          <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                            <path
                              fill='rgb(255,255,255)'
                              fillOpacity='1'
                              d=' M8.319000244140625,-13.677000045776367 C8.319000244140625,-13.677000045776367 19.2189998626709,8.123000144958496 19.2189998626709,8.123000144958496 C13.659000396728516,11.642999649047852 7.068999767303467,13.67300033569336 -0.0010000000474974513,13.67300033569336 C-7.071000099182129,13.67300033569336 -13.66100025177002,11.642999649047852 -19.22100067138672,8.123000144958496 C-19.22100067138672,8.123000144958496 -8.321000099182129,-13.677000045776367 -8.321000099182129,-13.677000045776367 C-6.160999774932861,-11.597000122070312 -3.2309999465942383,-10.32699966430664 -0.0010000000474974513,-10.32699966430664 C3.2290000915527344,-10.32699966430664 6.169000148773193,-11.597000122070312 8.319000244140625,-13.677000045776367z'
                            ></path>
                          </g>
                        </g>
                        <g
                          transform='matrix(1,0,0,1,64.68399810791016,27.89699935913086)'
                          opacity='1'
                          className={'block'}
                        >
                          <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                            <path
                              fill='rgb(255,255,255)'
                              fillOpacity='1'
                              d=' M15.314000129699707,16.10700035095215 C15.314000129699707,16.10700035095215 -8.685999870300293,16.10700035095215 -8.685999870300293,16.10700035095215 C-8.685999870300293,11.406999588012695 -11.38599967956543,7.336999893188477 -15.315999984741211,5.367000102996826 C-15.315999984741211,5.367000102996826 -4.576000213623047,-16.10300064086914 -4.576000213623047,-16.10300064086914 C7.214000225067139,-10.192999839782715 15.314000129699707,2.006999969482422 15.314000129699707,16.10700035095215z'
                            ></path>
                          </g>
                        </g>
                        <g
                          transform='matrix(1,0,0,1,23.31599998474121,27.89699935913086)'
                          opacity='1'
                          className={'block'}
                        >
                          <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                            <path
                              fill='rgb(255,255,255)'
                              fillOpacity='1'
                              d=' M4.584000110626221,-16.10300064086914 C4.584000110626221,-16.10300064086914 15.314000129699707,5.367000102996826 15.314000129699707,5.367000102996826 C11.383999824523926,7.336999893188477 8.684000015258789,11.406999588012695 8.684000015258789,16.10700035095215 C8.684000015258789,16.10700035095215 -15.315999984741211,16.10700035095215 -15.315999984741211,16.10700035095215 C-15.315999984741211,2.006999969482422 -7.216000080108643,-10.192999839782715 4.584000110626221,-16.10300064086914z'
                            ></path>
                          </g>
                        </g>
                        <g transform='matrix(1,0,0,1,44,44)' opacity='1' className={'block'}>
                          <g opacity='1' transform='matrix(1,0,0,1,0,0)'>
                            <path
                              fill='rgb(255,255,255)'
                              fillOpacity='1'
                              d=' M0,-4 C2.140000104904175,-4 3.890000104904175,-2.319999933242798 4,-0.20000000298023224 C4,-0.20000000298023224 4,0 4,0 C4,0 4,0.20000000298023224 4,0.20000000298023224 C3.890000104904175,2.319999933242798 2.140000104904175,4 0,4 C-2.2100000381469727,4 -4,2.2100000381469727 -4,0 C-4,-2.2100000381469727 -2.2100000381469727,-4 0,-4z'
                            ></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>
            </HoverCardTrigger>
            <VideoPlayerControllerHoverContent className={'pointer-events-none'}>
              <div className={cn('flex items-center justify-center text-xs px-2 py-1')}>
                {isFullScreen ? '退出全屏' : '进入全屏'}
              </div>
            </VideoPlayerControllerHoverContent>
          </HoverCard>
        </div>
      </div>

      <div className={progress()}>
        <div className={'size-full relative'}>
          <div
            style={{}}
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
      </div>
      <div className={pbp()}>
        <svg viewBox='0 0 1000 100' preserveAspectRatio='none' width='100%' height='100%'>
          <defs>
            <clipPath id='bpx-player-pbp-curve-path' clipPathUnits='userSpaceOnUse'>
              <path d='M 0 100 L 0 80 C 5.1 80.0, 5.1 43.4, 10.1 43.4 C 15.2 43.4, 15.2 56.5, 20.2 56.5 C 25.3 56.5, 25.3 59.6, 30.3 59.6 C 35.4 59.6, 35.4 63.5, 40.4 63.5 C 45.5 63.5, 45.5 51.9, 50.5 51.9 C 55.6 51.9, 55.6 67.5, 60.6 67.5 C 65.7 67.5, 65.7 69.1, 70.7 69.1 C 75.8 69.1, 75.8 69.6, 80.8 69.6 C 85.9 69.6, 85.9 71.3, 90.9 71.3 C 96.0 71.3, 96.0 72.4, 101.0 72.4 C 106.1 72.4, 106.1 72.6, 111.1 72.6 C 116.2 72.6, 116.2 17.0, 121.2 17.0 C 126.3 17.0, 126.3 64.1, 131.3 64.1 C 136.4 64.1, 136.4 51.3, 141.4 51.3 C 146.5 51.3, 146.5 70.8, 151.5 70.8 C 156.6 70.8, 156.6 75.5, 161.6 75.5 C 166.7 75.5, 166.7 74.5, 171.7 74.5 C 176.8 74.5, 176.8 74.7, 181.8 74.7 C 186.9 74.7, 186.9 75.5, 191.9 75.5 C 197.0 75.5, 197.0 75.5, 202.0 75.5 C 207.1 75.5, 207.1 75.5, 212.1 75.5 C 217.2 75.5, 217.2 0.0, 222.2 0.0 C 227.3 0.0, 227.3 76.0, 232.3 76.0 C 237.4 76.0, 237.4 71.9, 242.4 71.9 C 247.5 71.9, 247.5 76.3, 252.5 76.3 C 257.6 76.3, 257.6 76.5, 262.6 76.5 C 267.7 76.5, 267.7 76.7, 272.7 76.7 C 277.8 76.7, 277.8 76.3, 282.8 76.3 C 287.9 76.3, 287.9 76.4, 292.9 76.4 C 298.0 76.4, 298.0 57.8, 303.0 57.8 C 308.1 57.8, 308.1 64.6, 313.1 64.6 C 318.2 64.6, 318.2 76.1, 323.2 76.1 C 328.3 76.1, 328.3 76.2, 333.3 76.2 C 338.4 76.2, 338.4 76.4, 343.4 76.4 C 348.5 76.4, 348.5 76.7, 353.5 76.7 C 358.6 76.7, 358.6 76.6, 363.6 76.6 C 368.7 76.6, 368.7 76.7, 373.7 76.7 C 378.8 76.7, 378.8 76.6, 383.8 76.6 C 388.9 76.6, 388.9 76.6, 393.9 76.6 C 399.0 76.6, 399.0 76.8, 404.0 76.8 C 409.1 76.8, 409.1 77.1, 414.1 77.1 C 419.2 77.1, 419.2 76.2, 424.2 76.2 C 429.3 76.2, 429.3 68.9, 434.3 68.9 C 439.4 68.9, 439.4 73.8, 444.4 73.8 C 449.5 73.8, 449.5 77.2, 454.5 77.2 C 459.6 77.2, 459.6 77.0, 464.6 77.0 C 469.7 77.0, 469.7 76.9, 474.7 76.9 C 479.8 76.9, 479.8 76.8, 484.8 76.8 C 489.9 76.8, 489.9 77.1, 494.9 77.1 C 500.0 77.1, 500.0 77.0, 505.1 77.0 C 510.1 77.0, 510.1 76.6, 515.2 76.6 C 520.2 76.6, 520.2 76.9, 525.3 76.9 C 530.3 76.9, 530.3 77.1, 535.4 77.1 C 540.4 77.1, 540.4 77.1, 545.5 77.1 C 550.5 77.1, 550.5 77.0, 555.6 77.0 C 560.6 77.0, 560.6 76.7, 565.7 76.7 C 570.7 76.7, 570.7 73.7, 575.8 73.7 C 580.8 73.7, 580.8 77.0, 585.9 77.0 C 590.9 77.0, 590.9 77.4, 596.0 77.4 C 601.0 77.4, 601.0 77.4, 606.1 77.4 C 611.1 77.4, 611.1 76.3, 616.2 76.3 C 621.2 76.3, 621.2 77.5, 626.3 77.5 C 631.3 77.5, 631.3 77.5, 636.4 77.5 C 641.4 77.5, 641.4 77.3, 646.5 77.3 C 651.5 77.3, 651.5 77.3, 656.6 77.3 C 661.6 77.3, 661.6 71.6, 666.7 71.6 C 671.7 71.6, 671.7 77.6, 676.8 77.6 C 681.8 77.6, 681.8 77.4, 686.9 77.4 C 691.9 77.4, 691.9 77.3, 697.0 77.3 C 702.0 77.3, 702.0 77.3, 707.1 77.3 C 712.1 77.3, 712.1 77.4, 717.2 77.4 C 722.2 77.4, 722.2 77.4, 727.3 77.4 C 732.3 77.4, 732.3 77.3, 737.4 77.3 C 742.4 77.3, 742.4 76.2, 747.5 76.2 C 752.5 76.2, 752.5 76.1, 757.6 76.1 C 762.6 76.1, 762.6 66.5, 767.7 66.5 C 772.7 66.5, 772.7 75.1, 777.8 75.1 C 782.8 75.1, 782.8 67.5, 787.9 67.5 C 792.9 67.5, 792.9 77.3, 798.0 77.3 C 803.0 77.3, 803.0 77.2, 808.1 77.2 C 813.1 77.2, 813.1 77.1, 818.2 77.1 C 823.2 77.1, 823.2 77.3, 828.3 77.3 C 833.3 77.3, 833.3 77.1, 838.4 77.1 C 843.4 77.1, 843.4 77.0, 848.5 77.0 C 853.5 77.0, 853.5 76.5, 858.6 76.5 C 863.6 76.5, 863.6 60.0, 868.7 60.0 C 873.7 60.0, 873.7 74.3, 878.8 74.3 C 883.8 74.3, 883.8 77.5, 888.9 77.5 C 893.9 77.5, 893.9 77.4, 899.0 77.4 C 904.0 77.4, 904.0 77.2, 909.1 77.2 C 914.1 77.2, 914.1 72.2, 919.2 72.2 C 924.2 72.2, 924.2 66.1, 929.3 66.1 C 934.3 66.1, 934.3 77.2, 939.4 77.2 C 944.4 77.2, 944.4 77.0, 949.5 77.0 C 954.5 77.0, 954.5 76.7, 959.6 76.7 C 964.6 76.7, 964.6 77.2, 969.7 77.2 C 974.7 77.2, 974.7 75.2, 979.8 75.2 C 984.8 75.2, 984.8 78.0, 989.9 78.0 C 994.9 78.0, 994.9 80.0, 1000.0 80.0 L 1000 100 Z'></path>
            </clipPath>
            <clipPath id='bpx-player-pbp-played-path' clipPathUnits='userSpaceOnUse'>
              <rect x='3.13%' width='0.07%' y='0' height='100%'></rect>
              <path d='M 0.0 100 H 32.1 V 0 H 0.0 Z'></path>
            </clipPath>
          </defs>
          <g
            fillOpacity='0.2'
            clipPath='url(#bpx-player-pbp-curve-path)'
            className='bpx-player-pbp-videoshot'
          >
            <rect x='0' y='0' width='100%' height='100%' fill='rgba(255, 255, 255)'></rect>
            <rect
              x='0'
              y='0'
              width='100%'
              height='100%'
              clipPath='url(#bpx-player-pbp-played-path)'
              fill={'rgba(255,255,255'}
            ></rect>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default VideoPlayerController
