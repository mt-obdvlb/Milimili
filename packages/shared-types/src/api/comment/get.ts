export type CommentGetItem = {
  id: string
  content: string
  user: {
    id: string
    name: string
    avatar: string
  }
  createdAt: Date
  commentCount: number
  likeCount: number
}

export type CommentGetList = CommentGetItem[]
