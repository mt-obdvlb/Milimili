export type FavoriteListItem = {
  id: string
  video: {
    id: string
    title: string
    thumbnail: string
    time: number
    views: number
    danmakus: number
    publishedAt: string
    url: string
  }
  user: {
    name: string
    id: string
    avatar: string
  }
}

export type FavoriteList = FavoriteListItem[]
