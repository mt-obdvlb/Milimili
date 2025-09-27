import { FeedCreateDTO, FeedFollowingList, FeedRecentList, Result } from '@mtobdvlb/shared-types'
import request from '@/lib/request'

const baseURL = '/feeds'

const API = {
  recent: '/recent',
  following: '/following',
  publish: '/',
} as const

export const feedGetRecent = () => request.get<Result<FeedRecentList>>(`${baseURL}${API.recent}`)

export const feedGetFollowing = () =>
  request.get<Result<FeedFollowingList>>(`${baseURL}${API.following}`)

export const feedPublish = (data: FeedCreateDTO) =>
  request.post<Result>(`${baseURL}${API.publish}`, data)
