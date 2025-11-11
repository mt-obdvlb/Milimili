import request from '@/lib/request'
import {
  PageResult,
  Result,
  VideoCreateDTO,
  VideoGetDetail,
  VideoGetWaterLaterList,
  VideoList,
  VideoListItem,
  VideoListSpaceDTO,
  VideoShareDTO,
} from '@mtobdvlb/shared-types'
import { VideoGetWatchLaterRequest } from '@/types'

export const baseURL = '/videos'

export const API = {
  list: '/list',
  watchLater: '/watch-later',
  detail: '/detail',
  share: '/share',
  listLike: '/list-like',
  listSpace: '/list-space',
  create: '/',
  update: '/',
  delete: '/',
} as const

export const videoList = (page: number, pageSize: number, userId?: string) =>
  request.get<Result<PageResult<VideoListItem>>>(`${baseURL}${API.list}`, {
    params: {
      page,
      pageSize,
      userId,
    },
  })

export const videoGetWatchLater = (params: VideoGetWatchLaterRequest) =>
  request.get<Result<VideoGetWaterLaterList>>(`${baseURL}${API.watchLater}`, {
    params,
  })

export const videoGetDetail = (id: string) =>
  request.get<Result<VideoGetDetail>>(`${baseURL}${API.detail}/${id}`)

export const videoShare = (body: VideoShareDTO) =>
  request.post<Result>(`${baseURL}${API.share}`, body)

export const videoListLike = (userId: string) =>
  request.get<Result<VideoList>>(`${baseURL}${API.listLike}/${userId}`)

export const videoListSpace = (params: VideoListSpaceDTO) =>
  request.get<Result<PageResult<VideoListItem>>>(`${baseURL}${API.listSpace}`, {
    params,
  })

export const videoCreate = (body: Partial<VideoCreateDTO>) =>
  request.post<Result>(`${baseURL}${API.create}`, body)

export const videoUpdate = (id: string, body: Partial<VideoCreateDTO>) =>
  request.put<Result>(`${baseURL}${API.update}${id}`, body)

export const videoDelete = (id: string) => request.delete<Result>(`${baseURL}${API.delete}${id}`)
