import { messageGetStatistics } from '@/services'
import { useQuery } from '@tanstack/react-query'

export const useMessageStatistics = () => {
  const { data: messageStatistics } = useQuery({
    queryKey: ['message', 'statistics'],
    queryFn: () => messageGetStatistics(),
  })
  return {
    messageStatistics: messageStatistics?.data,
  }
}
