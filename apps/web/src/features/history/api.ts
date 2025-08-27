import { historyGetRecent } from '@/services/history'
import { useQuery } from '@tanstack/react-query'

export const useHistoryGetRecent = () => {
  const { data: historyRecentList } = useQuery({
    queryKey: ['history', 'recent'],
    queryFn: () => historyGetRecent(),
  })
  return { historyRecentList: historyRecentList?.data }
}
