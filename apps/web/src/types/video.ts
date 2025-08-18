export type VideoListItem = {
  id: string
  title: string
  url: string
  thumbnail: string
  time: number
  views: number
  danmakus: number
  username: string
  userId: string
  publishedAt: string
}

export type VideoListResponse = VideoListItem[]
