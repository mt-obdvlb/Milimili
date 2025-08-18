import { VideoListItem } from '@/types/video'
import request from '@/lib/request'
import { PageResult, Result } from '@mtobdvlb/shared-types'

export const baseURL = '/videos'

export const API = {
  list: '/list',
} as const

export const videoList = (page: number, pageSize: number) =>
  request.get<void, Result<PageResult<VideoListItem>>>(`${baseURL}${API.list}`, {
    params: {
      page,
      pageSize,
    },
  })
