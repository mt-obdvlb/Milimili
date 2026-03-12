'use client'

import { danmakuAdd, danmakuGet } from '@/services/danmaku'
import { useMutation, useQuery } from '@tanstack/react-query'
import { VideoAddDanmakuDTO } from '@mtobdvlb/shared-types'

export const useDanmakuGet = (videoId: string, isGet: boolean = true) => {
  const { data } = useQuery({
    queryKey: ['danmaku', videoId],
    queryFn: () => danmakuGet(videoId),
    enabled: isGet && !!videoId,
  })
  return {
    danmakuList: data?.data ?? [],
  }
}

export const useDanmakuAdd = () => {
  const { mutateAsync } = useMutation({
    mutationFn: (body: VideoAddDanmakuDTO) => danmakuAdd(body),
  })
  return {
    danmakuAdd: mutateAsync,
  }
}
