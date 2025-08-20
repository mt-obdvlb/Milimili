import request from '@/lib/request'

export const danmakuGet = (videoId: string) => request.get(`/videos/danmakus/${videoId}`)
