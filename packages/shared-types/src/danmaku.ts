import { Types } from 'mongoose'

export type DanmakuBase = {
  content: string
  color?: string
  position: 'top' | 'bottom' | 'scroll'
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
