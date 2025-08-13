import { Types } from 'mongoose'

export type CategoryBase = {
  name: string
}

export type CategoryDB = CategoryBase & {
  _id: Types.ObjectId
}

export type Category = CategoryBase & {
  id: string
  createdAt: string
  updatedAt: string
}
