import request from '@/lib/request'
import { LikeDTO, LikeGetDTO, Result, UnlikeDTO } from '@mtobdvlb/shared-types'

const baseURL = '/likes'

const API = {
  like: '',
  unlike: '',
  isLike: '',
} as const

export const like = (body: LikeDTO) => request.post<Result>(baseURL + API.like, body)

export const unlike = (params: UnlikeDTO) =>
  request.delete<Result>(baseURL + API.unlike, { params })

export const isLike = (params: LikeGetDTO) => request.get<Result>(baseURL + API.isLike, { params })
