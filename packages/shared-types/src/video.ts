import { Types } from 'mongoose'

export type VideoBase = {
  url: string
  title: string
  description?: string
  thumbnail?: string
  time: number
}

export type VideoDB = VideoBase & {
  userId: Types.ObjectId
  categoryId: Types.ObjectId
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
}

export type VideoState = VideoStateBase & {
  id: string
  videoId: string
}
