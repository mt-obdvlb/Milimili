import { FeedDB } from '@mtobdvlb/shared-types'
import mongoose, { Document, Schema } from 'mongoose'

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
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export const FeedModel = mongoose.model<IFeed>('Feed', feedSchema)
