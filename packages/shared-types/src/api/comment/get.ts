import { CommentTargetType } from '@/api'

export type CommentGetItem = {
  id: string
  content: string
  user: {
    id: string
    name: string
    avatar: string
  }
  createdAt: string
  comments?: number
  likes: number
  type: CommentTargetType
}

export type CommentGetList = CommentGetItem[]
