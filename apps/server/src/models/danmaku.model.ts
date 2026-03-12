import { Document, model, Schema, Types } from 'mongoose'
import { DanmakuPosition, VideoGetDanmakusItem } from '@mtobdvlb/shared-types'

type DanmakuBase = {
  content: string
  color?: string
  position: DanmakuPosition
  time: number
  fontSize: number
  sender: VideoGetDanmakusItem['sender']
}

type DanmakuDB = DanmakuBase & {
  videoId: Types.ObjectId
  userId: Types.ObjectId
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}
export type IDanmaku = DanmakuDB & Document

const danmakuSchema = new Schema<IDanmaku>(
  {
    videoId: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    color: {
      type: String,
      default: '#FFFFFF',
      required: true,
      trim: true,
    },
    position: {
      type: String,
      enum: ['top', 'bottom', 'scroll'],
      required: true,
    },
    time: { type: Number, required: true, min: 0 },
    fontSize: {
      type: Number,
      required: true,
      default: 24,
      min: 12,
      max: 36,
    },
    sender: {
      userId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      avatar: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  { versionKey: false, timestamps: true }
)

export const DanmakuModel = model<IDanmaku>('Danmaku', danmakuSchema)
