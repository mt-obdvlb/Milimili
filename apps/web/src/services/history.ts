import request from '@/lib/request'
import { Result } from '@mtobdvlb/shared-types'
import { HistoryListResult } from '@/types/history'

const baseURL = '/histories'

const API = {
  recent: '/recent',
} as const

export const historyGetRecent = () =>
  request.get<Result<HistoryListResult>>(`${baseURL}${API.recent}`)
