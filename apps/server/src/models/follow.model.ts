import { Document, model, Schema, Types } from 'mongoose'

type FollowBase = object

type FollowDB = FollowBase & {
  followrId: Types.ObjectId
  followingId: Types.ObjectId
  _id: Types.ObjectId
}

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
