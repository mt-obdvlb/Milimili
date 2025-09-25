import { Document, model, Schema, Types } from 'mongoose'

type ConversationBase = {
  lastContent: string
}

type ConversationDB = ConversationBase & {
  userId: Types.ObjectId
  toUserId?: Types.ObjectId
  _id: Types.ObjectId
}
export type IConversation = ConversationDB & Document

const conversationSechema = new Schema<IConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      required: true,
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
