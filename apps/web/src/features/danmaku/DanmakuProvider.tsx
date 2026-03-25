'use client'

import {
  DanmakuPlayerConfig,
  Result,
  VideoGetDanmakusItem,
  VideoGetDanmakusList,
} from '@mtobdvlb/shared-types'
import { createContext, ReactNode, useContext, useMemo, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useDanmakuGet } from '@/features/danmaku/api'

export const DEFAULT_DANMAKU_PLAYER_CONFIG: DanmakuPlayerConfig = {
  visible: true,
  modeFilter: 'all',
  opacity: 1,
  fontScale: 1,
  areaRatio: 0.7,
  speed: 1,
  smartMask: true,
}

type DanmakuRuntimeContextValue = {
  videoId: string
  danmakuList: VideoGetDanmakusList
  danmakuCount: number
  config: DanmakuPlayerConfig
  updateConfig: (patch: Partial<DanmakuPlayerConfig>) => void
  appendDanmaku: (item: VideoGetDanmakusItem) => void
  currentTime: number
  setCurrentTime: (time: number) => void
  currentDanmakuId: string
  focusedDanmakuId: string
  focusDanmaku: (id: string) => void
  registerSeekHandler: (handler: ((time: number) => void) | null) => void
  jumpToDanmaku: (item: VideoGetDanmakusItem) => void
}

const DanmakuRuntimeContext = createContext<DanmakuRuntimeContextValue | null>(null)

const sortDanmakus = (items: VideoGetDanmakusList) =>
  [...items].sort((a, b) => {
    if (a.time !== b.time) return a.time - b.time
    return a.createdAt.localeCompare(b.createdAt)
  })

export const DanmakuProvider = ({
  videoId,
  children,
}: {
  videoId: string
  children: ReactNode
}) => {
  const { danmakuList } = useDanmakuGet(videoId)
  const queryClient = useQueryClient()
  const seekHandlerRef = useRef<((time: number) => void) | null>(null)
  const [config, setConfig] = useState<DanmakuPlayerConfig>(DEFAULT_DANMAKU_PLAYER_CONFIG)
  const [currentTime, setCurrentTime] = useState(0)
  const [focusedDanmakuId, setFocusedDanmakuId] = useState('')

  const currentDanmakuId = useMemo(() => {
    for (let index = danmakuList.length - 1; index >= 0; index -= 1) {
      const item = danmakuList[index]
      if (!item) continue
      if (item.time <= currentTime && currentTime - item.time <= 0.8) {
        return item.id
      }
    }
    return ''
  }, [currentTime, danmakuList])

  const value = useMemo<DanmakuRuntimeContextValue>(
    () => ({
      videoId,
      danmakuList,
      danmakuCount: danmakuList.length,
      config,
      updateConfig: (patch) => setConfig((prev) => ({ ...prev, ...patch })),
      appendDanmaku: (item) => {
        queryClient.setQueryData<Result<VideoGetDanmakusList> | undefined>(
          ['danmaku', videoId],
          (previous) => {
            const next = previous?.data ?? []
            const deduped = next.filter((existing) => existing.id !== item.id)
            return {
              code: 0,
              data: sortDanmakus([...deduped, item]),
            }
          }
        )
        setFocusedDanmakuId(item.id)
      },
      currentTime,
      setCurrentTime,
      currentDanmakuId,
      focusedDanmakuId,
      focusDanmaku: setFocusedDanmakuId,
      registerSeekHandler: (handler) => {
        seekHandlerRef.current = handler
      },
      jumpToDanmaku: (item) => {
        seekHandlerRef.current?.(Math.max(item.time - 0.05, 0))
        setFocusedDanmakuId(item.id)
      },
    }),
    [config, currentDanmakuId, currentTime, danmakuList, focusedDanmakuId, queryClient, videoId]
  )

  return <DanmakuRuntimeContext.Provider value={value}>{children}</DanmakuRuntimeContext.Provider>
}

export const useDanmakuRuntime = () => {
  const context = useContext(DanmakuRuntimeContext)
  if (!context) {
    throw new Error('useDanmakuRuntime must be used within DanmakuProvider')
  }
  return context
}
