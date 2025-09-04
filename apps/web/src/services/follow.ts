import { Result } from '@mtobdvlb/shared-types'
import request from '@/lib/request'
import { FollowCreateRequest, FollowDeleteRequest, FollowGetRequest } from '@/types'

const baseURL = '/follows'

const API = {
  get: '/',
  create: '/',
  delete: '/',
} as const

export const followGet = async (params: FollowGetRequest) =>
  request.get<Result>(baseURL + API.get, { params })

export const followCreate = async (body: FollowCreateRequest) =>
  request.post<Result>(baseURL + API.create, body)

export const followDelete = async (data: FollowDeleteRequest) =>
  request.delete<Result>(baseURL + API.delete, { data })
