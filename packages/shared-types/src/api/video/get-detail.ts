export type VideoGetDetail = {
  user: {
    id: string
    name: string
    avatar: string
  }
  tags: string[]
  video: {
    id: string
    thumbnail: string
    description: string
    title: string
    duration: number
    time: number //总时长
    publishAt: string
    views: number
    likes: number
    comments: number
    favorites: number
    danmakus: number
    shares: number
    url: string
    categoryId: string
  }
}
