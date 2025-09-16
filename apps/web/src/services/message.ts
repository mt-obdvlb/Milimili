import { MessageStatisticsList, Result } from '@mtobdvlb/shared-types'
import request from '@/lib/request'

const baseURL = '/messages'

const API = {
  statistics: '/statistics',
} as const

export const messageGetStatistics = () =>
  request.get<Result<MessageStatisticsList>>(`${baseURL}${API.statistics}`)
