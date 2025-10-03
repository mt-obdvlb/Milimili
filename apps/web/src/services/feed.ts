import {
  FeedCreateDTO,
  FeedFollowingList,
  FeedGetById,
  FeedListDTO,
  FeedListItem,
  FeedListLikeTranspontDTO,
  FeedListLikeTranspontItem,
  FeedRecentList,
  FeedTranpont,
  FeedTranspontDTO,
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
  getById: '/',
  delete: '/',
  transpont: '/transpont',
  listLikeTranspont: '/like-transpont',
} as const

export const feedGetRecent = () => request.get<Result<FeedRecentList>>(`${baseURL}${API.recent}`)

export const feedGetFollowing = () =>
  request.get<Result<FeedFollowingList>>(`${baseURL}${API.following}`)

export const feedPublish = (data: FeedCreateDTO) =>
  request.post<Result>(`${baseURL}${API.publish}`, data)

export const feedList = (params: FeedListDTO) =>
  request.get<Result<PageResult<FeedListItem>>>(`${baseURL}${API.list}`, { params })

export const feedGetById = (id: string) =>
  request.get<Result<FeedGetById>>(`${baseURL}${API.getById}${id}`)

export const feedDelete = (id: string) => request.delete<Result>(`${baseURL}${API.delete}${id}`)

export const feedTranspont = (body: FeedTranspontDTO) =>
  request.post<Result<FeedTranpont>>(`${baseURL}${API.transpont}`, body)

export const feedListLikeTranspont = (id: string, params: FeedListLikeTranspontDTO) =>
  request.get<Result<PageResult<FeedListLikeTranspontItem>>>(
    `${baseURL}/${id}${API.listLikeTranspont}`,
    {
      params,
    }
  )
