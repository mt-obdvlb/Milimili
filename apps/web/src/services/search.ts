import { Result, SearchGetList } from '@mtobdvlb/shared-types'
import { SearchGetRequest } from '@/types/search'
import request from '@/lib/request'

const baseURL = '/searches'

const API = {
  get: '/',
}

export const searchGet = (params: SearchGetRequest) =>
  request.get<Result<SearchGetList>>(`${baseURL}${API.get}`, { params })
