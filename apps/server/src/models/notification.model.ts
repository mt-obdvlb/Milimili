import { Document, model, Schema, Types } from 'mongoose'
import { NotificationSourceType, NotificationType } from '@mtobdvlb/shared-types'

type NotificationBase = {
  type: NotificationType
  sourceType?: NotificationSourceType
  content?: string
  isRead: boolean
}

type NotificationDB = NotificationBase & {
  userId: Types.ObjectId
  fromUserId?: Types.ObjectId
  sourceId?: Types.ObjectId
  _id: Types.ObjectId
}
export type INotification = NotificationDB & Document

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    sourceId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    type: {
      type: String,
      required: true,
      enum: ['reply', 'mention', 'like', 'system', 'private_message'],
    },
    sourceType: {
      type: String,
      enum: ['comment', 'video', 'feed'],
      required: false,
    },
    content: { type: String, required: false },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
)

export const NotificationModel = model<INotification>('Notification', notificationSchema)
