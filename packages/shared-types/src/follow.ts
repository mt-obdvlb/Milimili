import { Types } from 'mongoose'

export type FollowBase = object

export type FollowDB = FollowBase & {
  followrId: Types.ObjectId
  followingId: Types.ObjectId
  _id: Types.ObjectId
}

export type Follow = FollowBase & {
  followerId: string
  followingId: string
  id: string
  createdAt: string
  updatedAt: string
}
