import { Types } from 'mongoose'

export type VideoStatus = 'pending' | 'scheduled' | 'published'
export type VideoSourceType = 'original' | 'repost'

export type VideoBase = {
  url: string
  title: string
  description?: string
  thumbnail: string
  time: number
  status: VideoStatus
  publishedAt: Date
  danmakuDisabled: boolean
  commentsDisabled: boolean
  sourceType: VideoSourceType
  isOpen: boolean
}

export type VideoDB = VideoBase & {
  userId: Types.ObjectId
  categoryId: Types.ObjectId
  _id: Types.ObjectId
}

export type Video = VideoBase & {
  id: string
  userId: string
  categoryId: string
  createdAt: string
  updatedAt: string
}

export type VideoStateBase = {
  views?: number
  likes?: number
  favorites?: number
  danmakus?: number
}

export type VideoStateDB = VideoStateBase & {
  videoId: Types.ObjectId
  _id: Types.ObjectId
}

export type VideoState = VideoStateBase & {
  id: string
  videoId: string
  createdAt: string
  updatedAt: string
}
