export type FeedRecentItem = {
  id: string
  video: {
    id: string
    title: string
    publishedAt: string
    thumbnail: string
  }
  user: {
    name: string
    id: string
    avatar: string
  }
}

export type FeedRecentVO = FeedRecentItem[]
