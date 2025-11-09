export type VideoListItem = {
  id: string
  title: string
  thumbnail: string
  time: number
  views: number
  danmakus: number
  shares?: number
  comments?: number
  favorites?: number
  likes?: number
  username: string
  publishedAt: string
  userId: string
  url: string
}

export type VideoList = VideoListItem[]
