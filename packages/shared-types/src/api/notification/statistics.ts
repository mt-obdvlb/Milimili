import { NotificationType } from './base'

export type NotificationStatisticsItem = {
  type: NotificationType
  count: number
}

export type NotificationStatisticsList = NotificationStatisticsItem[]
