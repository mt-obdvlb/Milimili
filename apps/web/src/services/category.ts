import request from '@/lib/request'
import { CategoryGetAllList, Result } from '@mtobdvlb/shared-types'

const baseURL = '/categories'

const API = {
  get: '/',
} as const

export const categoryGet = () => request.get<Result<CategoryGetAllList>>(`${baseURL}${API.get}`)
