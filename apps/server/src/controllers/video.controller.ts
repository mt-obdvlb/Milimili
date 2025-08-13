import { RequestHandler } from 'express'
import { getUploadURL } from '@/utils/ali-oss.util'
import { MESSAGE } from '@/constants'

export const videoUploadURL: RequestHandler = async (req, res) => {
  const { fileName } = req.query
  if (!fileName || typeof fileName !== 'string')
    return res.status(400).json({
      message: MESSAGE.INVALID_PARAMS,
      code: 1,
    })
  const data = await getUploadURL(fileName)
  return res.status(200).json({ data, code: 0 })
}
