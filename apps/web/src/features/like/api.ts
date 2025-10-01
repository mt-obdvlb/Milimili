import { LikeDTO, LikeGetDTO } from '@mtobdvlb/shared-types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isLike, like as likeApi, unlike as unlikeApi } from '@/services/like'

export const useLike = (params: LikeDTO) => {
  const queryClient = useQueryClient()
  const { mutateAsync: like } = useMutation({
    mutationFn: () => likeApi(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['like', params],
      })
    },
  })
  const { mutateAsync: unlike } = useMutation({
    mutationFn: () => unlikeApi(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['like', params],
      })
    },
  })
  return { like, unlike }
}

export const useLikeGet = (params: LikeGetDTO) => {
  const { data } = useQuery({
    queryKey: ['like', params],
    queryFn: () => isLike(params),
  })
  return {
    isLike: !data?.code,
  }
}
