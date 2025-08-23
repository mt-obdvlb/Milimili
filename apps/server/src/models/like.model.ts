import { Document, model, Schema, Types } from 'mongoose'
import { LikeTargetType } from '@mtobdvlb/shared-types'

type LikeBase = {
  targetType: LikeTargetType
}

type LikeDB = LikeBase & {
  userId: Types.ObjectId
  targetId: Types.ObjectId
  _id: Types.ObjectId
}
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
