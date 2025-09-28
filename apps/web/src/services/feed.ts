import {
  FeedCreateDTO,
  FeedFollowingList,
  FeedListItem,
  FeedRecentList,
  PageResult,
  Result,
} from '@mtobdvlb/shared-types'
import request from '@/lib/request'

const baseURL = '/feeds'

const API = {
  recent: '/recent',
  following: '/following',
  publish: '/',
  list: '/',
} as const

export const feedGetRecent = () => request.get<Result<FeedRecentList>>(`${baseURL}${API.recent}`)

export const feedGetFollowing = () =>
  request.get<Result<FeedFollowingList>>(`${baseURL}${API.following}`)

export const feedPublish = (data: FeedCreateDTO) =>
  request.post<Result>(`${baseURL}${API.publish}`, data)

export const feedList = (params: { page: number }) =>
  request.get<Result<PageResult<FeedListItem>>>(`${baseURL}${API.list}`, { params })
