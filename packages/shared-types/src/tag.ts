import { Types } from 'mongoose'

export type TagBase = {
  name: string
}

export type TagDB = TagBase & {
  videoId: Types.ObjectId
}

export type Tag = TagBase & {
  videoId: string
  id: string
  createdAt: string
  updatedAt: string
}
