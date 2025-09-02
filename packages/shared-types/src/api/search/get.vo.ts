import { PageResult } from '@/common'

export type SearchUserItem = {
  id: string
  name: string
  videos: number
  avatar: string
  followers: number
}

export type SearchVideoItem = {
  id: string
  title: string
  thumbnail: string
  danmakus: number
  views: number
  time: number
  publishedAt: string
  url: string
}

export type SearchGetItem = {
  video?: SearchVideoItem
  user: SearchUserItem
}

export type SearchRecommendUser = {
  user: SearchUserItem
  video: SearchVideoItem[]
}

export type SearchGetList = {
  list: PageResult<SearchGetItem>
  user?: SearchRecommendUser
}
