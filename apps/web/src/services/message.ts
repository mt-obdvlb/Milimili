import { MessageListItem, MessageStatisticsList, PageResult, Result } from '@mtobdvlb/shared-types'
import request from '@/lib/request'
import { MessageListRequest, MessageSendWhisperRequest } from '@/types'

const baseURL = '/messages'

const API = {
  statistics: '/statistics',
  list: '/',
  sendWhisper: '/whisper',
  delete: '/',
} as const

export const messageGetStatistics = () =>
  request.get<Result<MessageStatisticsList>>(`${baseURL}${API.statistics}`)

export const messageGetList = (params: MessageListRequest) =>
  request.get<Result<PageResult<MessageListItem>>>(`${baseURL}${API.list}`, {
    params,
  })

export const messageSendWhisper = (params: MessageSendWhisperRequest) =>
  request.post<Result>(`${baseURL}${API.sendWhisper}`, params)

export const messageDelete = (id: string) => request.delete<Result>(`${baseURL}${API.delete}${id}`)
