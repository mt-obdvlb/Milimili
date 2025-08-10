import { Document, model, Schema } from 'mongoose'
import { LikeDB } from '@mtobdvlb/shared-types'

export type ILike = LikeDB & Document

const likeSchema = new Schema<ILike>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    targetType: {
      type: String,
      required: true,
      enum: ['video', 'feed', 'comment'],
    },
  },
  { versionKey: false, timestamps: true }
)

export const LikeModel = model<ILike>('Like', likeSchema)
