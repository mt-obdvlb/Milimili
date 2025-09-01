import request from '@/lib/request'
import { Result, SearchLogGetList, SearchLogTop10List } from '@mtobdvlb/shared-types'

const baseURL = '/search-logs'

const API = {
  top10: '/top10',
  get: '/',
} as const

export const searchLogGetTop10 = () =>
  request.get<Result<SearchLogTop10List>>(`${baseURL}${API.top10}`)

export const searchLogGet = (keyword: string) =>
  request.get<Result<SearchLogGetList>>(`${baseURL}${API.get}`, { params: { keyword } })
