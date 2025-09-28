import { FeedType } from '@/api'

export type FeedListItem = {
  id: string
  title?: string
  content?: string
  video?: {
    id: string
    title: string
    description?: string
    views: number
    time: number
    danmakus: number
    thumbnail: string
    url: string
  }
  user: {
    name: string
    id: string
    avatar: string
  }
  comment?: string
  images?: string[]
  likes: number
  comments: number
  publishedAt: string
  type: FeedType
  referenceId?: string
}

export type FeedList = FeedListItem[]
