import { feedGetFollowing, feedGetRecent } from '@/services/feed'
import { useQuery } from '@tanstack/react-query'

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
