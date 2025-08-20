import { RequestHandler } from 'express'
import { getUploadURL } from '@/utils/ali-oss.util'
import { MESSAGE } from '@/constants'
import { PageResult, Result } from '@mtobdvlb/shared-types'
import { VideoListItem } from '@/vos/video/list.vo'
import { ParamsDictionary } from 'express-serve-static-core'
import { VideoService } from '@/services/video.service'
import { VideoListDTO } from '@/dtos/video/list.dto'
import { VideoCreateDTO } from '@/dtos/video/create.dto'
import { VideoGetDanmakusVO } from '@/vos/video/get-danmakus.vo'
import { VideoGetDanmakusDTO } from '@/dtos/video/get-danmakus.dto'
import { VideoAddDanmakuDTO } from '@/dtos/video/add-danmaku.dto'

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

export const videoList: RequestHandler<
  ParamsDictionary,
  Result<PageResult<VideoListItem>>,
  VideoListDTO
> = async (req, res) => {
  const { page, pageSize } = req.body
  const list = await VideoService.list({
    page: Number(page),
    pageSize: Number(pageSize),
  })
  return res.status(200).json({
    code: 0,
    data: {
      total: list.length,
      list,
    },
  })
}

export const videoCreate: RequestHandler<ParamsDictionary, Result, VideoCreateDTO> = async (
  req,
  res
) => {
  if (!req.user) {
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  }
  await VideoService.create(req.body, req.user!.id)
  return res.status(200).json({
    code: 0,
  })
}

export const videoGetDanmakus: RequestHandler<
  ParamsDictionary,
  Result<VideoGetDanmakusVO>,
  VideoGetDanmakusDTO
> = async (req, res) => {
  const videoId = req.body.videoId
  if (!videoId) {
    return res.status(400).json({
      code: 400,
      message: MESSAGE.INVALID_PARAMS,
    })
  }
  const data = await VideoService.getDanmakus(videoId)
  return res.status(200).json({
    code: 0,
    data,
  })
}

export const videoAddDanmaku: RequestHandler<ParamsDictionary, Result, VideoAddDanmakuDTO> = async (
  req,
  res
) => {
  if (!req.user?.id) {
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  }
  req.body.userId = req.user.id

  await VideoService.addDanmaku(req.body)
  return res.status(200).json({
    code: 0,
  })
}
