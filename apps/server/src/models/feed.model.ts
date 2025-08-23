import { FeedType } from '@mtobdvlb/shared-types'
import mongoose, { Document, Schema, Types } from 'mongoose'

type FeedBase = {
  content: string
  mediaUrls?: string[]
  likesCount?: number
  commentsCount?: number
  type: FeedType
  commentsDisabled: boolean
  isOpen: boolean
  publishedAt: Date
}

type FeedDB = FeedBase & {
  videoId: Types.ObjectId
  userId: Types.ObjectId
  _id: Types.ObjectId
}
export type IFeed = FeedDB & Document

const feedSchema = new Schema<IFeed>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    mediaUrls: {
      type: [String],
      default: [],
    },
    likesCount: {
      type: Number,
      default: 0,
      required: true,
    },
    commentsCount: {
      type: Number,
      default: 0,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
    },
    type: {
      type: String,
      enum: ['image-text', 'video'] satisfies FeedType[],
      required: true,
    },
    commentsDisabled: {
      type: Boolean,
      default: false,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: true,
      required: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export const FeedModel = mongoose.model<IFeed>('Feed', feedSchema)
