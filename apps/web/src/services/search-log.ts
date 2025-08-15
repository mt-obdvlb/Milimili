import request from '@/lib/request'
import { Result } from '@mtobdvlb/shared-types'
import { SearchLogTop10Result } from '@/types/search-log'

const baseURL = '/search-logs'

const API = {
  top10: '/top10',
} as const

export const searchLogGetTop10 = () =>
  request.get<void, Result<SearchLogTop10Result>>(`${baseURL}${API.top10}`)
