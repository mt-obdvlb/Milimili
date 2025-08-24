import { NotificationStatisticsList, Result } from '@mtobdvlb/shared-types'
import request from '@/lib/request'

const baseURL = '/notifications'

const API = {
  statistics: '/statistics',
} as const

export const notificationGetStatistics = () =>
  request.get<Result<NotificationStatisticsList>>(`${baseURL}${API.statistics}`)
