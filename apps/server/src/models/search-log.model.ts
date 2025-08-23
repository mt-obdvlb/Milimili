import { Document, model, Schema, Types } from 'mongoose'

export type SearchLogBase = {
  keyword: string
}

export type SearchLogDB = SearchLogBase & {
  _id: Types.ObjectId
}
export type ISearchLog = SearchLogDB & Document

const searchLogSchema = new Schema<ISearchLog>(
  {
    keyword: { type: String, required: true, trim: true },
  },
  { versionKey: false, timestamps: true }
)

export const SearchLogModel = model<ISearchLog>('SearchLog', searchLogSchema)
