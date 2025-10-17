import {
  MessageGetConversationList,
  MessageListItem,
  MessageReadDTO,
  MessageStatisticsList,
  PageResult,
  Result,
} from '@mtobdvlb/shared-types'
import request from '@/lib/request'
import { MessageListRequest, MessageSendWhisperRequest } from '@/types'

const baseURL = '/messages'

const API = {
  statistics: '/statistics',
  list: '/',
  sendWhisper: '/send-whisper',
  delete: '/',
  getConversation: '/conversation',
  createConversation: '/conversation',
  deleteConversation: '/conversation',
  read: '/read',
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

export const messageRead = ({ userId, type }: MessageReadDTO & { userId?: string }) =>
  request.put<Result>(userId ? `${baseURL}${API.read}/${userId}` : `${baseURL}${API.read}`, {
    type,
  })

export const messageGetConversation = (userId: string) =>
  request.get<Result<MessageGetConversationList>>(`${baseURL}${API.getConversation}/${userId}`)

export const messageCreateConversation = (userId: string) =>
  request.post<Result>(`${baseURL}${API.createConversation}/${userId}`)

export const messageDeleteConversation = (conversationId: string) =>
  request.delete<Result>(`${baseURL}${API.deleteConversation}/${conversationId}`)
