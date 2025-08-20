import { Types } from 'mongoose'

export type DanmakuPosition = 'top' | 'bottom' | 'scroll'

export type DanmakuBase = {
  content: string
  color?: string
  position: DanmakuPosition
  time: number
}

export type DanmakuDB = DanmakuBase & {
  videoId: Types.ObjectId
  userId: Types.ObjectId
  _id: Types.ObjectId
}

export type Danmaku = DanmakuBase & {
  videoId: string
  userId: string
  id: string
  createdAt: string
  updatedAt: string
}
