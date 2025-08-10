import request from '@/lib/request'
import { UserGetResponse, UserLoginRequest } from '@/types/user'
import { Result } from '@mtobdvlb/shared-types'

const baseURL = '/user'

const API = {
  login: '/login',
  logout: '/logout',
  get: '',
} as const

export const loginUser = (data: UserLoginRequest) =>
  request.post<UserLoginRequest, Result>(`${baseURL}${API.login}`, data)

export const logoutUser = () => request.post<void, Result>(`${baseURL}${API.logout}`)

export const getUser = () => request.get<void, Result<UserGetResponse>>(`${baseURL}${API.get}`)
