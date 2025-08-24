import request from '@/lib/request'
import { Result, VideoGetDanmakusList } from '@mtobdvlb/shared-types'

export const danmakuGet = (videoId: string) =>
  request.get<Result<VideoGetDanmakusList>>(`/videos/danmakus/${videoId}`)
