import { Types } from 'mongoose'

export type UserBase = {
  name?: string
  email: string
  avatar?: string
}

export type UserDB = UserBase & {
  password?: string
  _id: Types.ObjectId
}

export type User = UserBase & {
  id: string
  createdAt: string
  updatedAt: string
}
