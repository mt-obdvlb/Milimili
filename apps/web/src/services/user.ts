import request from '@/lib/request'
import { UserLoginRequest } from '@/types/user'
import { Result, UserGetInfo, UserGetInfoHome } from '@mtobdvlb/shared-types'

const baseURL = '/users'

const API = {
  login: '/login',
  logout: '/logout',
  get: '/info',
  homeInfo: '/info/home',
} as const

export const loginUser = (data: UserLoginRequest) =>
  request.post<Result>(`${baseURL}${API.login}`, data)

export const logoutUser = () => request.post<Result>(`${baseURL}${API.logout}`)

export const getUser = () => request.get<Result<UserGetInfo>>(`${baseURL}${API.get}`)

export const userGetHomeInfo = () =>
  request.get<Result<UserGetInfoHome>>(`${baseURL}${API.homeInfo}`)
