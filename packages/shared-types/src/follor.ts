import { Types } from 'mongoose'

export type FollowBase = object

export type FollowDB = FollowBase & {
  followerId: Types.ObjectId
  followeeId: Types.ObjectId
}

export type Follow = FollowBase & {
  followerId: string
  followeeId: string
  id: string
  createdAt: string
  updatedAt: string
}
