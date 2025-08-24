import request from '@/lib/request'
import { Result, SearchLogTop10List } from '@mtobdvlb/shared-types'

const baseURL = '/search-logs'

const API = {
  top10: '/top10',
} as const

export const searchLogGetTop10 = () =>
  request.get<Result<SearchLogTop10List>>(`${baseURL}${API.top10}`)
