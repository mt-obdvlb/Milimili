import { Types } from 'mongoose'

export type CommentTargetType = 'video' | 'feed'

export type CommentBase = {
  targetType: CommentTargetType
  content: string
  likesCount?: number
}

export type CommentDB = CommentBase & {
  userId: Types.ObjectId
  targetId: Types.ObjectId
  parentId?: Types.ObjectId
}

export type Comment = CommentBase & {
  userId: string
  targetId: string
  parentId?: string
  id: string
  createdAt: string
  updatedAt: string
}
