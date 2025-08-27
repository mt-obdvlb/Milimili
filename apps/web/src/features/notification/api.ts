import { notificationGetStatistics } from '@/services'
import { useQuery } from '@tanstack/react-query'

export const useNotificationStatistics = () => {
  const { data: notificationStatistics } = useQuery({
    queryKey: ['notification', 'statistics'],
    queryFn: () => notificationGetStatistics(),
  })
  return {
    notificationStatistics: notificationStatistics?.data,
  }
}
