import { Document, model, Schema, Types } from 'mongoose'

type VideoStateBase = {
  views: number
  likes: number
  favorites: number
  danmakus: number
}

type VideoStateDB = VideoStateBase & {
  videoId: Types.ObjectId
  _id: Types.ObjectId
}

export type IVideoState = VideoStateDB & Document

const videoStatsSchema = new Schema<IVideoState>(
  {
    videoId: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    views: { type: Number, default: 0, required: true },
    likes: { type: Number, default: 0, required: true },
    favorites: { type: Number, default: 0, required: true },
    danmakus: { type: Number, default: 0, required: true },
  },
  { versionKey: false, timestamps: true }
)

export const VideoStatsModel = model<IVideoState>('VideoStats', videoStatsSchema)
