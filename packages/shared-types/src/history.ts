import { Types } from 'mongoose'

export type HistoryBase = {
  watchedAt?: string
  duration?: number
}

export type HistoryDB = HistoryBase & {
  userId: Types.ObjectId
  videoId: Types.ObjectId
}

export type History = HistoryBase & {
  userId: string
  videoId: string
  id: string
  createdAt: string
  updatedAt: string
}
