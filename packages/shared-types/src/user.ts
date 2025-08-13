import { Types } from 'mongoose'

export type UserBase = {
  email: string
}

export type UserDB = UserBase & {
  password?: string
  _id: Types.ObjectId
  name: string
  avatar: string
}

export type User = UserBase & {
  id: string
  createdAt: string
  updatedAt: string
  avatar?: string
  name?: string
}
