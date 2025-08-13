import { Document, model, Schema } from 'mongoose'
import { VideoDB, VideoSourceType, VideoStatus } from '@mtobdvlb/shared-types'

export type IVideo = VideoDB & Document

const videoSchema = new Schema<IVideo>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v: string) => /^https?:\/\/.+/.test(v),
        message: 'url 必须是合法的地址',
      },
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    thumbnail: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v: string) => /^https?:\/\/.+/.test(v),
        message: '缩略图必须是合法的地址',
      },
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    time: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'published'] satisfies VideoStatus[],
      required: true,
      default: 'published',
    },
    publishedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    danmakuDisabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    commentsDisabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    sourceType: {
      type: String,
      enum: ['original', 'repost'] satisfies VideoSourceType[],
      required: true,
      default: 'original',
    },
    isOpen: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { versionKey: false, timestamps: true }
)

export const VideoModel = model<IVideo>('Video', videoSchema)
