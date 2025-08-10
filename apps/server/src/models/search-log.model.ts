import { Document, model, Schema } from 'mongoose'
import { SearchLogDB } from '@mtobdvlb/shared-types'

export type ISearchLog = SearchLogDB & Document

const searchLogSchema = new Schema<ISearchLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    keyword: { type: String, required: true, trim: true },
  },
  { versionKey: false, timestamps: true }
)

export const SearchLogModel = model<ISearchLog>('SearchLog', searchLogSchema)
