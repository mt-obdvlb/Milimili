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
    watchedAt: {
      type: Date,
      required: true,
    },
    duration: { type: Number, default: 0, required: true },
  },
  { versionKey: false, timestamps: true }
)

export const HistoryModel = model<IHistory>('History', historySchema)
