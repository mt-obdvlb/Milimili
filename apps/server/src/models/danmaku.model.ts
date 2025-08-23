import { Document, model, Schema, Types } from 'mongoose'
import { DanmakuPosition } from '@mtobdvlb/shared-types'

type DanmakuBase = {
  content: string
  color?: string
  position: DanmakuPosition
  time: number
}

type DanmakuDB = DanmakuBase & {
  videoId: Types.ObjectId
  userId: Types.ObjectId
  _id: Types.ObjectId
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
    content: { type: String, required: true, trim: true },
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
  },
  { versionKey: false, timestamps: true }
)

export const DanmakuModel = model<IDanmaku>('Danmaku', danmakuSchema)
