'use client'

import { RefObject, useEffect, useMemo, useRef } from 'react'
import { NativeDanmakuEngine, NativeDanmakuItem } from '@/features/danmaku/NativeDanmakuEngine'
import { useDanmakuRuntime } from '@/features/danmaku/DanmakuProvider'
import { VideoGetDanmakusItem } from '@mtobdvlb/shared-types'

interface UseDanmakuManagerProps {
  videoRef: RefObject<HTMLVideoElement | null>
}

export const useDanmakuManager = ({ videoRef }: UseDanmakuManagerProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const topContainerRef = useRef<HTMLDivElement>(null)
  const bottomContainerRef = useRef<HTMLDivElement>(null)

  const scrollEngineRef = useRef<NativeDanmakuEngine | null>(null)
  const topEngineRef = useRef<NativeDanmakuEngine | null>(null)
  const bottomEngineRef = useRef<NativeDanmakuEngine | null>(null)
  const previousIdsRef = useRef<string[]>([])

  const { danmakuList, config, setCurrentTime, registerSeekHandler } = useDanmakuRuntime()

  const filteredDanmakus = useMemo(
    () =>
      danmakuList.filter((item) => {
        if (config.modeFilter !== 'all' && item.mode !== config.modeFilter) return false
        if (config.smartMask && item.position === 'bottom') return false
        return true
      }),
    [config.modeFilter, config.smartMask, danmakuList]
  )

  useEffect(() => {
    if (!scrollContainerRef.current || !topContainerRef.current || !bottomContainerRef.current)
      return

    const scrollEngine = new NativeDanmakuEngine(scrollContainerRef.current, 'scroll')
    const topEngine = new NativeDanmakuEngine(topContainerRef.current, 'top')
    const bottomEngine = new NativeDanmakuEngine(bottomContainerRef.current, 'bottom')

    scrollEngine.init()
    topEngine.init()
    bottomEngine.init()

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
    const engines = [scrollEngineRef.current, topEngineRef.current, bottomEngineRef.current].filter(
      Boolean
    )
    for (const engine of engines) {
      engine?.setConfig({
        scale: config.fontScale,
        opacity: config.opacity,
        areaRatio: config.areaRatio,
        speed: config.speed,
        density: config.density,
      })
    }
  }, [config.areaRatio, config.density, config.fontScale, config.opacity, config.speed])

  useEffect(() => {
    const mapDanmaku = (item: VideoGetDanmakusItem): NativeDanmakuItem => ({
      id: item.id,
      text: item.content,
      stime: item.time,
      size: item.fontSize,
      color: Number(`0x${item.color.replace(/^#/, '')}`),
    })

    const nextIds = filteredDanmakus.map((item) => item.id)
    const prevIds = previousIdsRef.current
    const prevSet = new Set(prevIds)
    const nextSet = new Set(nextIds)
    const removed = prevIds.some((id) => !nextSet.has(id))
    const added = filteredDanmakus.filter((item) => !prevSet.has(item.id))

    const scrollEngine = scrollEngineRef.current
    const topEngine = topEngineRef.current
    const bottomEngine = bottomEngineRef.current
    if (!scrollEngine || !topEngine || !bottomEngine) return

    const sendToTrack = (item: VideoGetDanmakusItem) => {
      const mapped = mapDanmaku(item)
      if (item.position === 'scroll') scrollEngine.send(mapped)
      if (item.position === 'top') topEngine.send(mapped)
      if (item.position === 'bottom') bottomEngine.send(mapped)
    }

    if (!removed && added.length === 1 && prevIds.length > 0) {
      sendToTrack(added[0]!)
      previousIdsRef.current = nextIds
      return
    }

    const scrollDanmaku = filteredDanmakus
      .filter((item) => item.position === 'scroll')
      .map(mapDanmaku)
    const topDanmaku = filteredDanmakus.filter((item) => item.position === 'top').map(mapDanmaku)
    const bottomDanmaku = filteredDanmakus
      .filter((item) => item.position === 'bottom')
      .map(mapDanmaku)

    scrollEngine.load(scrollDanmaku)
    topEngine.load(topDanmaku)
    bottomEngine.load(bottomDanmaku)
    previousIdsRef.current = nextIds
  }, [filteredDanmakus])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const play = () => {
      if (!config.visible) return
      scrollEngineRef.current?.start()
      topEngineRef.current?.start()
      bottomEngineRef.current?.start()
    }

    const pause = () => {
      scrollEngineRef.current?.stop()
      topEngineRef.current?.stop()
      bottomEngineRef.current?.stop()
    }

    const sync = () => {
      const currentTime = video.currentTime
      setCurrentTime(currentTime)
      scrollEngineRef.current?.time(currentTime)
      topEngineRef.current?.time(currentTime)
      bottomEngineRef.current?.time(currentTime)
    }

    const updateRate = () => {
      const playbackRate = video.playbackRate || 1
      scrollEngineRef.current?.setPlaybackRate(playbackRate)
      topEngineRef.current?.setPlaybackRate(playbackRate)
      bottomEngineRef.current?.setPlaybackRate(playbackRate)
    }

    registerSeekHandler((time) => {
      video.currentTime = time
      sync()
    })

    updateRate()
    sync()
    video.addEventListener('play', play)
    video.addEventListener('playing', play)
    video.addEventListener('pause', pause)
    video.addEventListener('waiting', pause)
    video.addEventListener('timeupdate', sync)
    video.addEventListener('seeking', sync)
    video.addEventListener('seeked', sync)
    video.addEventListener('loadeddata', sync)
    video.addEventListener('ratechange', updateRate)

    if (!video.paused && config.visible) play()

    return () => {
      registerSeekHandler(null)
      video.removeEventListener('play', play)
      video.removeEventListener('playing', play)
      video.removeEventListener('pause', pause)
      video.removeEventListener('waiting', pause)
      video.removeEventListener('timeupdate', sync)
      video.removeEventListener('seeking', sync)
      video.removeEventListener('seeked', sync)
      video.removeEventListener('loadeddata', sync)
      video.removeEventListener('ratechange', updateRate)
    }
  }, [config.visible, registerSeekHandler, setCurrentTime, videoRef])

  useEffect(() => {
    if (config.visible) {
      const currentTime = videoRef.current?.currentTime ?? 0
      scrollEngineRef.current?.time(currentTime)
      topEngineRef.current?.time(currentTime)
      bottomEngineRef.current?.time(currentTime)
      if (!videoRef.current?.paused) {
        scrollEngineRef.current?.start()
        topEngineRef.current?.start()
        bottomEngineRef.current?.start()
      }
      return
    }

    scrollEngineRef.current?.stop()
    topEngineRef.current?.stop()
    bottomEngineRef.current?.stop()
    scrollEngineRef.current?.clear()
    topEngineRef.current?.clear()
    bottomEngineRef.current?.clear()
  }, [config.visible, videoRef])

  return {
    scrollContainerRef,
    topContainerRef,
    bottomContainerRef,
  }
}
