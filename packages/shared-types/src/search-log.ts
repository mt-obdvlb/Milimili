import { Types } from 'mongoose'

export type SearchLogBase = {
  keyword: string
}

export type SearchLogDB = SearchLogBase & {
  userId: Types.ObjectId
}

export type SearchLog = SearchLogBase & {
  userId: string
  id: string
  createdAt: string
  updatedAt: string
}
