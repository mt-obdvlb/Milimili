import { Document, model, Schema } from 'mongoose'
import { NotificationDB } from '@mtobdvlb/shared-types'

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
      enum: ['reply', 'mention', 'like', 'system'],
    },
    sourceType: {
      type: String,
      enum: ['comment', 'video', 'systemMessage'],
      required: false,
    },
    content: { type: String, required: false },
    isRead: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
)

export const NotificationModel = model<INotification>('Notification', notificationSchema)
