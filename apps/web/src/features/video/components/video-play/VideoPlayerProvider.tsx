'use client'

import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { toast } from '@/lib'

type VideoContextType = {
  videoRef: RefObject<HTMLVideoElement | null>
  paused: boolean
  currentTime: number
  duration: number
  volume: number
  isWebFull: boolean
  isFullScreen: boolean
  play: () => void
  pause: () => void
  togglePlay: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleWebFull: () => void
  toggleFullScreen: (containerRef?: RefObject<HTMLDivElement | null>) => void
  isPlayed: boolean
  progress: number
  speed: number
  setSpeed: (speed: number) => void
  isEnded: boolean
}

const VideoContext = createContext<VideoContextType | null>(null)

export const useVideoContext = () => {
  const ctx = useContext(VideoContext)
  if (!ctx) throw new Error('useVideoContext must be inside VideoProvider')
  return ctx
}

export const VideoProvider = ({
  children,
  videoRef,
  containerRef,
}: {
  children: ReactNode
  videoRef: RefObject<HTMLVideoElement | null>
  containerRef: RefObject<HTMLDivElement | null>
}) => {
  const [paused, setPaused] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.5)
  const [isWebFull, setIsWebFull] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isPlayed, setIsPlayed] = useState(false)
  const [speed, setSpeedState] = useState(1)
  const [isEnded, setIsEnded] = useState(false)

  // 播放
  const play = () => {
    if (!videoRef.current) return
    void videoRef.current.play()
    setIsPlayed(true)
    setIsEnded(false) // 播放时一定不是 ended
  }

  const pause = () => videoRef.current?.pause()

  // toggle
  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      void v.play()
      setIsPlayed(true)
      setIsEnded(false) // 播放时清理结束状态
    } else {
      v.pause()
    }
  }, [videoRef])

  // 跳转
  const seek = (time: number) => {
    const v = videoRef.current
    if (!v) return
    if (v.readyState < 1) return
    v.currentTime = time
    if (time < v.duration - 0.05) {
      setIsEnded(false) // 用户往前拖动 → 非结束
    }
  }
  // 音量
  const setVolume = (v: number) => {
    if (videoRef.current) videoRef.current.volume = v
    setVolumeState(v)
  }

  // 倍速
  const setSpeed = (s: number) => {
    if (videoRef.current) videoRef.current.playbackRate = s
    setSpeedState(s)
  }

  // 播放进度
  const progress = useMemo(() => {
    if (!duration || !isFinite(duration)) return 0
    return currentTime / duration
  }, [currentTime, duration])

  const toggleWebFull = () => setIsWebFull((prev) => !prev)

  const toggleFullScreen = () => {
    const target = containerRef?.current
    if (!target) return

    if (document.fullscreenElement) {
      void document.exitFullscreen()
      setIsFullScreen(false)
    } else {
      void target.requestFullscreen()
      setIsFullScreen(true)
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // --------------------
    // 事件处理函数
    // --------------------
    const handlePlay = () => setPaused(false)
    const handlePause = () => setPaused(true)
    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleVolumeChange = () => setVolumeState(video.volume)
    const handleRateChange = () => setSpeedState(video.playbackRate)
    const handleClick = () => togglePlay()
    const handleLoadedMetadata = () => {
      if (video.readyState >= 1 && isFinite(video.duration)) {
        setDuration(video.duration)
      }
    }
    const handleEnded = () => setIsEnded(true) // 播放结束

    // --------------------
    // 事件绑定
    // --------------------
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('volumechange', handleVolumeChange)
    video.addEventListener('ratechange', handleRateChange)
    video.addEventListener('click', handleClick)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)

    // 如果已经加载完 metadata，则立即设置 duration
    if (video.readyState >= 1 && isFinite(video.duration)) {
      setDuration(video.duration)
    }

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('volumechange', handleVolumeChange)
      video.removeEventListener('ratechange', handleRateChange)
      video.removeEventListener('click', handleClick)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
    }
  }, [videoRef, togglePlay])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current
      const container = containerRef.current
      if (!video || !container) return

      const target = e.target as HTMLElement
      if (target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
        return

      const isFocused = container.matches(':focus-within') || isWebFull || isFullScreen

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'KeyF':
          e.preventDefault()
          toggleFullScreen()
          toast(`进入全屏`)
          break
        case 'ArrowLeft':
          e.preventDefault()
          seek(Math.max(video.currentTime - 5, 0))
          toast('后退5秒')

          break
        case 'ArrowRight':
          e.preventDefault()
          seek(Math.min(video.currentTime + 5, video.duration))
          toast('前进5秒')
          break
        case 'ArrowUp':
          if (isFocused) {
            e.preventDefault()
            const newVol = Math.min(video.volume + 0.05, 1)
            setVolume(newVol)
            toast(`音量${Math.round(newVol * 100)}`)
          }
          break
        case 'ArrowDown':
          if (isFocused) {
            e.preventDefault()
            const newVol = Math.max(video.volume - 0.05, 0)
            setVolume(newVol)
            toast(`音量${Math.round(newVol * 100)}`)
          }
          break
      }
    }

    const handleWheel = (e: WheelEvent) => {
      const video = videoRef.current
      const container = containerRef.current
      if (!video || !container) return

      const isFocused = container.matches(':focus-within') || isWebFull || isFullScreen
      if (!isFocused) return

      e.preventDefault()
      const delta = -e.deltaY / 100 // 上滚正, 下滚负
      const newVol = Math.max(0, Math.min(video.volume + delta * 0.05, 1))
      setVolume(newVol)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('wheel', handleWheel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, containerRef, isWebFull, isFullScreen])

  return (
    <VideoContext.Provider
      value={{
        videoRef,
        paused,
        currentTime,
        duration,
        volume,
        isWebFull,
        isFullScreen,
        play,
        pause,
        togglePlay,
        seek,
        setVolume,
        toggleWebFull,
        toggleFullScreen,
        isPlayed,
        progress,
        speed,
        setSpeed,
        isEnded,
      }}
    >
      {children}
    </VideoContext.Provider>
  )
}
