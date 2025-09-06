import { VideoGetWatchLaterRequest } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { videoGetWatchLater } from '@/services'

export const useWatchLaterList = (params: VideoGetWatchLaterRequest) => {
  const { data: videoWatchLaterList } = useQuery({
    queryKey: ['video', 'watchLater', params],
    queryFn: () => videoGetWatchLater(params),
  })
  return { videoWatchLaterList: videoWatchLaterList?.data ?? [] }
}
