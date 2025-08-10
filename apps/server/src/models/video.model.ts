import { Document, model, Schema } from 'mongoose'
import { VideoDB } from '@mtobdvlb/shared-types'

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
  },
  { versionKey: false, timestamps: true }
)

export const VideoModel = model<IVideo>('Video', videoSchema)
