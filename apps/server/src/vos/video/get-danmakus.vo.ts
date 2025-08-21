import { DanmakuPosition } from '@mtobdvlb/shared-types'

export type VideoGetDanmakusItem = {
  content: string
  time: number
  position: DanmakuPosition
  color: string
  id: string
}

export type VideoGetDanmakusVO = VideoGetDanmakusItem[]
