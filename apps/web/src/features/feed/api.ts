import { feedGetRecent } from '@/services/feed'
import { useQuery } from '@tanstack/react-query'

export const useFeedGetRecent = () => {
  const { data: feedRecentList } = useQuery({
    queryKey: ['feed', 'recent'],
    queryFn: () => feedGetRecent(),
  })
  return { feedRecentList: feedRecentList?.data }
}
