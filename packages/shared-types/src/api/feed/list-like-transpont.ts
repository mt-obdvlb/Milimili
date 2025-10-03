export type FeedListLikeTranspontItem = {
  type: 'like' | 'transpont'
  user: {
    name: string
    avatar: string
    id: string
  }
}

export type FeedListLikeTranspontList = FeedListLikeTranspontItem[]
