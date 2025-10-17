import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { followCreate, followDelete, followGet } from '@/services/follow'

export const useFollow = (followingId: string) => {
  const queryClient = useQueryClient()
  const { mutateAsync: follow } = useMutation({
    mutationFn: followCreate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['follow', followingId],
      })
    },
  })
  const { mutateAsync: unfollow } = useMutation({
    mutationFn: followDelete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['follow', followingId],
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
