import request from '@/lib/request'
import { HistoryList, Result } from '@mtobdvlb/shared-types'

const baseURL = '/histories'

const API = {
  recent: '/recent',
} as const

export const historyGetRecent = () => request.get<Result<HistoryList>>(`${baseURL}${API.recent}`)
