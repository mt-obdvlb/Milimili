import { Document, model, Schema, Types } from 'mongoose'
import { MessageSourceType, MessageType } from '@mtobdvlb/shared-types'

type MessageBase = {
  type: MessageType
  sourceType?: MessageSourceType
  content?: string
  isRead: boolean
}

type MessageDB = MessageBase & {
  userId: Types.ObjectId
  fromUserId?: Types.ObjectId
  sourceId?: Types.ObjectId
  createdAt: Date
  _id: Types.ObjectId
}
export type IMessage = MessageDB & Document

const messageSchema = new Schema<IMessage>(
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
      enum: ['reply', 'at', 'like', 'system', 'whisper'],
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

export const MessageModel = model<IMessage>('Message', messageSchema)
