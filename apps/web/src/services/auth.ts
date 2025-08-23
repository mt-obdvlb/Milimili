import request from '@/lib/request'
import { Result } from '@mtobdvlb/shared-types'

const baseURL = '/auth'

const API = {
  sendCode: '/send-code',
} as const

export const authSendCode = (data: { email: string }) =>
  request.post<Result>(`${baseURL}${API.sendCode}`, data)
