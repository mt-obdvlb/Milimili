import { FeedFollowingList, FeedRecentList, Result } from '@mtobdvlb/shared-types'
import request from '@/lib/request'

const baseURL = '/feeds'

const API = {
  recent: '/recent',
  following: '/following',
} as const

export const feedGetRecent = () => request.get<Result<FeedRecentList>>(`${baseURL}${API.recent}`)

export const feedGetFollowing = () =>
  request.get<Result<FeedFollowingList>>(`${baseURL}${API.following}`)
