import request from '@/lib/request'
import {
  CategoryGetAllItem,
  CategoryGetAllList,
  CategoryGetByNameDTO,
  Result,
} from '@mtobdvlb/shared-types'

const baseURL = '/categories'

const API = {
  get: '/',
  getById: '/id',
  getByName: '/name',
} as const

export const categoryGet = () => request.get<Result<CategoryGetAllList>>(`${baseURL}${API.get}`)

export const categoryGetById = (id: string) =>
  request.get<Result<CategoryGetAllItem>>(`${baseURL}${API.getById}/${id}`)

export const categoryGetByName = (params: CategoryGetByNameDTO) =>
  request.get<Result<CategoryGetAllItem>>(`${baseURL}${API.getByName}`, { params })
