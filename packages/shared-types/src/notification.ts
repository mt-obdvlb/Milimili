import { Types } from 'mongoose'

export type NotificationType = 'reply' | 'mention' | 'like' | 'system'
export type NotificationSourceType = 'comment' | 'video' | 'systemMessage'

export type NotificationBase = {
  type: NotificationType
  sourceType?: NotificationSourceType
  content?: string
  isRead?: boolean
}

export type NotificationDB = NotificationBase & {
  userId: Types.ObjectId
  fromUserId?: Types.ObjectId
  sourceId?: Types.ObjectId
}

export type Notification = NotificationBase & {
  userId: string
  fromUserId?: string
  sourceId?: string
  id: string
  createdAt: string
  updatedAt: string
}
