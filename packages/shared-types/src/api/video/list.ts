export type VideoListItem = {
  id: string
  title: string
  thumbnail: string
  time: number
  views: number
  danmakus: number
  username: string
  publishedAt: string
  userId: string
  url: string
}

export type VideoList = VideoListItem[]
