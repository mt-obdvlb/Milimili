import { LikeDTO, LikeGetDTO, UnlikeDTO } from '@mtobdvlb/shared-types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { like as likeApi, unlike as unlikeApi } from '@/services/like'

export const useLike = (params: LikeDTO) => {
  const queryClient = useQueryClient()
  const { mutateAsync: like } = useMutation({
    mutationFn: likeApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['like', params],
      })
    },
  })
  return { like }
}

export const useUnlike = (params: UnlikeDTO) => {
  const queryClient = useQueryClient()
  const { mutateAsync: unlike } = useMutation({
    mutationFn: unlikeApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['like', params],
      })
    },
  })
  return { unlike }
}

export const useLikeGet = (params: LikeGetDTO) => {
  const { data } = useQuery({
    queryKey: ['like', params],
    queryFn: () => likeApi(params),
  })
  return {
    isLike: !data?.code,
  }
}
