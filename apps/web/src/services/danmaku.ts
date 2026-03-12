import request from '@/lib/request'
import {
  Result,
  VideoAddDanmakuDTO,
  VideoGetDanmakusItem,
  VideoGetDanmakusList,
} from '@mtobdvlb/shared-types'

export const danmakuGet = (videoId: string) =>
  request.get<Result<VideoGetDanmakusList>>(`/videos/danmakus/${videoId}`)

export const danmakuAdd = (body: VideoAddDanmakuDTO) =>
  request.post<Result<VideoGetDanmakusItem>>(`/videos/danmakus`, body)
