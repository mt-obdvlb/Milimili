import request from '@/lib/request'
import { PageResult, Result, VideoGetWaterLaterList, VideoListItem } from '@mtobdvlb/shared-types'
import { VideoGetWatchLaterRequest } from '@/types'

export const baseURL = '/videos'

export const API = {
  list: '/list',
  watchLater: '/watch-later',
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
