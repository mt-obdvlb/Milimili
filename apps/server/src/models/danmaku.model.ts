import { Document, model, Schema } from 'mongoose'
import { DanmakuDB } from '@mtobdvlb/shared-types'

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
    color: { type: String, default: '#FFFFFF', trim: true },
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
