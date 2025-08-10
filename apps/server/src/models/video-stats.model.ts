import { Document, model, Schema } from 'mongoose'
import { VideoStateDB } from '@mtobdvlb/shared-types'

export type IVideoState = VideoStateDB & Document

const videoStatsSchema = new Schema<IVideoState>(
  {
    videoId: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    danmakus: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: true }
)

export const VideoStatsModel = model<IVideoState>('VideoStats', videoStatsSchema)
