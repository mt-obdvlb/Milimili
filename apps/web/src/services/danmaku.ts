import request from '@/lib/request'
import { DanmakuGetResult } from '@/types/danmaku'
import { Result } from '@mtobdvlb/shared-types'

export const danmakuGet = (videoId: string) =>
  request.get<Result<DanmakuGetResult>>(`/videos/danmakus/${videoId}`)
