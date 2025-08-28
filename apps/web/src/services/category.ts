import request from '@/lib/request'
import { CategoryGetAllItem, CategoryGetAllList, Result } from '@mtobdvlb/shared-types'

const baseURL = '/categories'

const API = {
  get: '/',
  getById: '/',
} as const

export const categoryGet = () => request.get<Result<CategoryGetAllList>>(`${baseURL}${API.get}`)

export const categoryGetById = (id: string) =>
  request.get<Result<CategoryGetAllItem>>(`${baseURL}${API.getById}${id}`)
