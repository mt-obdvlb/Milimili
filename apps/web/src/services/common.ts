import { CommonUpload, CommonUploadDTO, Result } from '@mtobdvlb/shared-types'
import request from '@/lib/request'

const baseURL = '/commons'

const API = {
  upload: '/upload',
} as const

export const commonUpload = (params: CommonUploadDTO) =>
  request.get<Result<CommonUpload>>(baseURL + API.upload, { params })
