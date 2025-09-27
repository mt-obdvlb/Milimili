import { feedGetFollowing, feedGetRecent, feedPublish } from '@/services/feed'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useFeedGetRecent = () => {
  const { data: feedRecentList } = useQuery({
    queryKey: ['feed', 'recent'],
    queryFn: () => feedGetRecent(),
  })
  return { feedRecentList: feedRecentList?.data }
}

export const useFeedGetFollowingList = () => {
  const { data: followingList } = useQuery({
    queryKey: ['feed', 'following'],
    queryFn: () => feedGetFollowing(),
  })
  return {
    followingList: followingList?.data,
  }
}

export const useFeedPublish = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: publishFeed } = useMutation({
    mutationFn: feedPublish,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['feed', 'list'] })
    },
  })
  return { publishFeed }
}
