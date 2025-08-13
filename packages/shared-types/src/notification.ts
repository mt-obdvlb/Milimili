import { Types } from 'mongoose'

export type NotificationType = 'reply' | 'mention' | 'like' | 'system' | 'private_message'
export type NotificationSourceType = 'comment' | 'video' | 'feed'

export type NotificationBase = {
  type: NotificationType
  sourceType?: NotificationSourceType
  content?: string
  isRead: boolean
}

export type NotificationDB = NotificationBase & {
  userId: Types.ObjectId
  fromUserId?: Types.ObjectId
  sourceId?: Types.ObjectId
  _id: Types.ObjectId
}

export type Notification = NotificationBase & {
  userId: string
  fromUserId?: string
  sourceId?: string
  id: string
  createdAt: string
  updatedAt: string
}
