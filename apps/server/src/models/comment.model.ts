import { Document, model, Schema, Types } from 'mongoose'
import { CommentTargetType } from '@mtobdvlb/shared-types'

type CommentBase = {
  targetType: CommentTargetType
  content: string
  likesCount?: number
}

type CommentDB = CommentBase & {
  userId: Types.ObjectId
  targetId: Types.ObjectId
  _id: Types.ObjectId
}

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
      enum: ['video', 'feed', 'comment'] satisfies CommentTargetType[],
      required: true,
    },
    content: { type: String, required: true, trim: true },
    likesCount: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: true }
)

export const CommentModel = model<IComment>('Comment', commentSchema)
