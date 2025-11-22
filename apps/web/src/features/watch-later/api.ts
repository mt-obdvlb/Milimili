import { VideoGetWatchLaterRequest } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { favoriteCleanWatchLater, favoriteIsWatchLater, videoGetWatchLater } from '@/services'

export const useWatchLaterList = (params: VideoGetWatchLaterRequest) => {
  const { data: videoWatchLaterList } = useQuery({
    queryKey: ['video', 'list', 'watchLater', params],
    queryFn: () => videoGetWatchLater(params),
  })
  return { videoWatchLaterList: videoWatchLaterList?.data }
}

export const useWatchLaterCleanUp = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: cleanUp } = useMutation({
    mutationFn: () => favoriteCleanWatchLater(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['video', 'list', 'watchLater'],
        exact: false,
      })
    },
  })
  return { cleanUp }
}

export const useIsWatchLater = (videoId: string) => {
  const { data: isWatchLater } = useQuery({
    queryKey: ['favorite', videoId],
    queryFn: () => favoriteIsWatchLater(videoId),
  })
  return { isFavorite: isWatchLater?.code === 1 }
}
