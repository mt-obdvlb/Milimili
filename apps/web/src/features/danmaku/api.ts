'use client'

import { danmakuGet } from '@/services/danmaku'
import { useQuery } from '@tanstack/react-query'

export const useDanmakuGet = (videoId: string, isGet: boolean = true) => {
  const { data } = useQuery({
    queryKey: ['danmaku', videoId],
    queryFn: () => danmakuGet(videoId),
    enabled: isGet,
  })
  return {
    danmakuList: data?.data,
  }
}
