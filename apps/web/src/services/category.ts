import request from '@/lib/request'
import { Result } from '@mtobdvlb/shared-types'
import { CategoryListResponse } from '@/types/category'

const baseURL = '/categories'

const API = {
  get: '/',
} as const

export const categoryGet = () => request.get<Result<CategoryListResponse>>(`${baseURL}${API.get}`)
