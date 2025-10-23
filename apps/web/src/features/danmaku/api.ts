'use client'

import { danmakuAdd, danmakuGet } from '@/services/danmaku'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useDanmakuGet = (videoId: string, isGet: boolean = true) => {
  const { data } = useQuery({
    queryKey: ['danmaku', videoId],
    queryFn: () => danmakuGet(videoId),
    enabled: isGet,
  })
  return {
    danmakuList: data?.data ?? [],
  }
}

export const useDanmakuAdd = () => {
  const { mutateAsync } = useMutation({
    mutationFn: danmakuAdd,
  })
  return {
    danmakuAdd: mutateAsync,
  }
}
