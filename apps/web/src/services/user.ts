import request from '@/lib/request'
import { UserFindPasswordRequest, UserLoginRequest } from '@/types/user'
import { Result, UserGetByName, UserGetInfo, UserGetInfoHome } from '@mtobdvlb/shared-types'

const baseURL = '/users'

const API = {
  login: '/login',
  logout: '/logout',
  get: '/info',
  homeInfo: '/info/home',
  getByEmail: '/email',
  findPassword: '/find-password',
  getByName: '/name',
} as const

export const loginUser = (data: UserLoginRequest) =>
  request.post<Result>(`${baseURL}${API.login}`, data)

export const logoutUser = () => request.post<Result>(`${baseURL}${API.logout}`)

export const getUser = () => request.get<Result<UserGetInfo>>(`${baseURL}${API.get}`)

export const userGetHomeInfo = () =>
  request.get<Result<UserGetInfoHome>>(`${baseURL}${API.homeInfo}`)

export const getUserByEmail = (email: string) =>
  request.get<Result>(`${baseURL}${API.getByEmail}?email=${email}`)

export const userFindPassword = (params: UserFindPasswordRequest) =>
  request.put<Result>(`${baseURL}${API.findPassword}`, params)

export const getUserByName = (name: string) =>
  request.get<Result<UserGetByName>>(`${baseURL}${API.getByName}?name=${name}`)
