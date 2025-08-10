import { Types } from 'mongoose'

export type LikeTargetType = 'video' | 'feed' | 'comment'

export type LikeBase = {
  targetType: LikeTargetType
}

export type LikeDB = LikeBase & {
  userId: Types.ObjectId
  targetId: Types.ObjectId
}

export type Like = LikeBase & {
  userId: string
  targetId: string
  id: string
  createdAt: string
  updatedAt: string
}
