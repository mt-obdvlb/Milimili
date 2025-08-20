import { danmakuGet } from '@/services/danmaku'
import { useQuery } from '@tanstack/react-query'

export const useDanmakuGet = (videoId: string, skipToken?: boolean) => {
  const { data } = useQuery({
    queryKey: ['danmaku', videoId],
    queryFn: () => danmakuGet(videoId),
    enabled: !skipToken,
  })
  return data
}
