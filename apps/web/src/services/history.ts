import request from '@/lib/request'
import {
  HistoryAddDTO,
  HistoryDeleteBatchDTO,
  HistoryGetItem,
  HistoryList,
  PageResult,
  Result,
} from '@mtobdvlb/shared-types'
import { HistoryGetRequest } from '@/types'

const baseURL = '/histories'

const API = {
  recent: '/recent',
  list: '/list',
  deleteBatch: '/delete',
  clear: '/clear',
  add: '/',
} as const

export const historyGetRecent = () => request.get<Result<HistoryList>>(`${baseURL}${API.recent}`)

export const historyGetList = (params: HistoryGetRequest) =>
  request.get<Result<PageResult<HistoryGetItem>>>(`${baseURL}${API.list}`, {
    params,
  })

export const historyDeleteBatch = (params: HistoryDeleteBatchDTO) =>
  request.post<Result>(baseURL + API.deleteBatch, params)

export const historyClearUp = () => request.delete<Result>(`${baseURL}${API.clear}`)

export const historyAdd = (body: HistoryAddDTO) =>
  request.post<Result>(`${baseURL}${API.add}`, body)
