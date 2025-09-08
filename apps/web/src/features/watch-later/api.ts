import { VideoGetWatchLaterRequest } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { favoriteCleanWatchLater, videoGetWatchLater } from '@/services'

export const useWatchLaterList = (params: VideoGetWatchLaterRequest) => {
  const { data: videoWatchLaterList } = useQuery({
    queryKey: ['video', 'watchLater', params],
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
        queryKey: ['video', 'watchLater'],
        exact: false,
      })
    },
  })
  return { cleanUp }
}
