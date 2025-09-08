import { RequestHandler } from 'express'
import { getUploadURL } from '@/utils'
import { ParamsDictionary } from 'express-serve-static-core'
import { CommonUpload, CommonUploadDTO, Result } from '@mtobdvlb/shared-types'

export const commonUploadFile: RequestHandler<
  ParamsDictionary,
  Result<CommonUpload>,
  CommonUploadDTO
> = async (req, res) => {
  const fileName = req.body.fileName
  if (!fileName) {
    return res.status(400).json({
      code: 400,
      message: '请选择文件',
    })
  }
  const data = await getUploadURL(fileName)
  return res.status(200).json({
    code: 0,
    data,
  })
}
