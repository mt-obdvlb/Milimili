import { Types } from 'mongoose'

export type SearchLogBase = {
  keyword: string
}

export type SearchLogDB = SearchLogBase & {
  _id: Types.ObjectId
}

export type SearchLog = SearchLogBase & {
  id: string
  createdAt: string
  updatedAt: string
}
