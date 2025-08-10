import { Document, model, Schema } from 'mongoose'
import { HistoryDB } from '@mtobdvlb/shared-types'

export type IHistory = HistoryDB & Document

const historySchema = new Schema<IHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    watchedAt: { type: Date, default: Date.now },
    duration: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: true }
)

export const HistoryModel = model<IHistory>('History', historySchema)
