import { NotificationType } from '@mtobdvlb/shared-types'

export type NotificationStatisticsItem = {
  type: NotificationType
  count: number
}

export type NotificationStatisticsVO = NotificationStatisticsItem[]
