import { Document, model, Schema } from 'mongoose'
import { FollowDB } from '@mtobdvlb/shared-types'

export type IFollow = FollowDB & Document

const followSchema = new Schema<IFollow>(
  {
    followrId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    followingId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
)

export const FollowModel = model<IFollow>('Follow', followSchema)
