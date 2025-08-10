import { Document, model, Schema } from 'mongoose'
import { CommentDB } from '@mtobdvlb/shared-types'

export type IComment = CommentDB & Document

const commentSchema = new Schema<IComment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    }, // 可能是 Video 或 Feed
    targetType: {
      type: String,
      enum: ['video', 'feed'],
      required: true,
    },
    content: { type: String, required: true, trim: true },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      required: false,
    },
    likesCount: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: true }
)

export const CommentModel = model<IComment>('Comment', commentSchema)
