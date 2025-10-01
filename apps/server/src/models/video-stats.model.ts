import { Document, model, Schema, Types } from 'mongoose'

type VideoStateBase = {
  viewsCount: number
  likesCount: number
  favoritesCount: number
  danmakusCount: number
  commentsCount: number
}

type VideoStateDB = VideoStateBase & {
  videoId: Types.ObjectId
  _id: Types.ObjectId
}

export type IVideoStats = VideoStateDB & Document

const videoStatsSchema = new Schema<IVideoStats>(
  {
    videoId: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    viewsCount: { type: Number, default: 0, required: true },
    likesCount: { type: Number, default: 0, required: true },
    favoritesCount: { type: Number, default: 0, required: true },
    danmakusCount: { type: Number, default: 0, required: true },
    commentsCount: { type: Number, default: 0, required: true },
  },
  { versionKey: false, timestamps: true }
)

export const VideoStatsModel = model<IVideoStats>('VideoStats', videoStatsSchema)
