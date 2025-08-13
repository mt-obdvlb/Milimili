import { Types } from 'mongoose'

export type FeedBase = {
  content: string
  mediaUrls?: string[]
  likesCount?: number
  commentsCount?: number
}

export type FeedDB = FeedBase & {
  userId: Types.ObjectId
  _id: Types.ObjectId
}

export type Feed = FeedBase & {
  userId: string
  id: string
  createdAt: string
  updatedAt: string
}
