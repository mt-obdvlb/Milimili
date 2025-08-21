import { Types } from 'mongoose'

export type FeedType = 'image-text' | 'video'

export type FeedBase = {
  content: string
  mediaUrls?: string[]
  likesCount?: number
  commentsCount?: number
  type: FeedType
  commentsDisabled: boolean
  isOpen: boolean
  publishedAt: Date
}

export type FeedDB = FeedBase & {
  videoId: Types.ObjectId
  userId: Types.ObjectId
  _id: Types.ObjectId
}

export type Feed = FeedBase & {
  videoId: string
  userId: string
  id: string
  createdAt: string
  updatedAt: string
}
