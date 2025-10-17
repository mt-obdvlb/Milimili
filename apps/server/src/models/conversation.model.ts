import { Document, model, Schema, Types } from 'mongoose'

type ConversationBase = {
  lastContent: string
}

type ConversationDB = ConversationBase & {
  userId: Types.ObjectId
  toUserId: Types.ObjectId
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}
export type IConversation = ConversationDB & Document

const conversationSechema = new Schema<IConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    lastContent: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

export const ConversationModel = model<IConversation>('Conversation', conversationSechema)
