import { Document, model, Schema } from 'mongoose'
import { FollowDB } from '@mtobdvlb/shared-types'

export type IFollow = FollowDB & Document

const followSchema = new Schema<IFollow>(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    followeeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
)

export const FollowModel = model<IFollow>('Follow', followSchema)
