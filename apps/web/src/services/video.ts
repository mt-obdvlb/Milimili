import request from '@/lib/request'
import {
  PageResult,
  Result,
  VideoGetDetail,
  VideoGetWaterLaterList,
  VideoListItem,
  VideoShareDTO,
} from '@mtobdvlb/shared-types'
import { VideoGetWatchLaterRequest } from '@/types'

export const baseURL = '/videos'

export const API = {
  list: '/list',
  watchLater: '/watch-later',
  detail: '/detail',
  share: '/share',
} as const

export const videoList = (page: number, pageSize: number) =>
  request.get<Result<PageResult<VideoListItem>>>(`${baseURL}${API.list}`, {
    params: {
      page,
      pageSize,
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
