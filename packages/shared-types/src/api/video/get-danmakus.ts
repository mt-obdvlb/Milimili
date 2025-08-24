import { DanmakuPosition } from '../danmaku'

export type VideoGetDanmakusItem = {
  content: string
  time: number
  position: DanmakuPosition
  color: string
  id: string
}

export type VideoGetDanmakusList = VideoGetDanmakusItem[]
