import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { followCreate, followDelete, followGet, followList } from '@/services/follow'
import { FollowListDTO } from '@mtobdvlb/shared-types'

export const useFollow = (followingId: string) => {
  const queryClient = useQueryClient()
  const { mutateAsync: follow } = useMutation({
    mutationFn: followCreate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['follow', followingId],
      })
      await queryClient.invalidateQueries({
        queryKey: ['feed', 'list'],
      })
    },
  })
  const { mutateAsync: unfollow } = useMutation({
    mutationFn: followDelete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['follow', followingId],
      })
      await queryClient.invalidateQueries({
        queryKey: ['feed', 'list'],
      })
    },
  })

  return {
    follow,
    unfollow,
  }
}

export const useFollowGet = (followingId: string) => {
  const { data } = useQuery({
    queryFn: () => followGet({ followingId }),
    queryKey: ['follow', followingId],
  })
  return {
    isFollowing: !data?.code,
  }
}

export const useFollowList = (params: FollowListDTO) => {
  const { data } = useQuery({
    queryFn: () => followList(params),
    queryKey: ['followList', params],
  })
  return {
    followList: data?.data?.list ?? [],
    total: data?.data?.total ?? 0,
  }
}
