import {
  CommentDTO,
  CommentGetDTO,
  CommentGetItem,
  PageResult,
  Result,
} from '@mtobdvlb/shared-types'
import request from '@/lib/request'

const baseURL = '/comments'

const API = {
  list: '/list',
  comment: '',
}

export const commentList = (params: CommentGetDTO) =>
  request.get<Result<PageResult<CommentGetItem>>>(baseURL + API.list, { params })

export const commentCreate = (body: CommentDTO) => request.post<Result>(baseURL + API.comment, body)
