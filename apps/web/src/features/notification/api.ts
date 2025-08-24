import { notificationGetStatistics } from '@/services'

export const getNotificationStatistics = async () => {
  const { data: notificationStatistics } = await notificationGetStatistics()
  return {
    notificationStatistics,
  }
}
