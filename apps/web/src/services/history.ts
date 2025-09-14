import request from '@/lib/request'
import { HistoryGetItem, HistoryList, PageResult, Result } from '@mtobdvlb/shared-types'
import { HistoryDeleteBatchRequest, HistoryGetRequest } from '@/types'

const baseURL = '/histories'

const API = {
  recent: '/recent',
  list: '/list',
  deleteBatch: '/',
  clear: '/clear',
} as const

export const historyGetRecent = () => request.get<Result<HistoryList>>(`${baseURL}${API.recent}`)

export const historyGetList = (params: HistoryGetRequest) =>
  request.get<Result<PageResult<HistoryGetItem>>>(`${baseURL}${API.list}`, {
    params,
  })

export const historyDeleteBatch = (params: HistoryDeleteBatchRequest) =>
  request.delete<Result>(`${baseURL}${API.deleteBatch}`, {
    params,
  })

export const historyClearUp = () => request.delete<Result>(`${baseURL}${API.clear}`)
