import request from '@/lib/request'
import { Result, VideoAddDanmakuDTO, VideoGetDanmakusList } from '@mtobdvlb/shared-types'

export const danmakuGet = (videoId: string) =>
  request.get<Result<VideoGetDanmakusList>>(`/videos/danmakus/${videoId}`)

export const danmakuAdd = (body: VideoAddDanmakuDTO) =>
  request.post<Result>(`/videos/danmakus`, body)
