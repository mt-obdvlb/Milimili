import { NotificationType } from '@/api'

export type NotificationStatisticsItem = {
  type: NotificationType
  count: number
}

export type NotificationStatisticsList = NotificationStatisticsItem[]
