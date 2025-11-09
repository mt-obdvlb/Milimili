import { RequestHandler } from 'express'
import { MESSAGE } from '@/constants'
import {
  PageResult,
  Result,
  VideoAddDanmakuDTO,
  VideoCreateDTO,
  VideoGetDanmakusDTO,
  VideoGetDanmakusList,
  VideoGetDetail,
  VideoGetWatchLaterDTO,
  VideoGetWaterLaterList,
  VideoList,
  VideoListDTO,
  VideoListItem,
  VideoListSpaceDTO,
  VideoShareDTO,
} from '@mtobdvlb/shared-types'
import { ParamsDictionary } from 'express-serve-static-core'
import { VideoService } from '@/services/video.service'

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
  await VideoService.create(req.body, req.user!.id, req.params.videoId)
  return res.status(200).json({
    code: 0,
  })
}

export const videoGetDanmakus: RequestHandler<
  ParamsDictionary,
  Result<VideoGetDanmakusList>,
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

export const videoGetWatchLater: RequestHandler<
  ParamsDictionary,
  Result<VideoGetWaterLaterList>,
  VideoGetWatchLaterDTO
> = async (req, res) => {
  const userId = req.user?.id
  if (!userId)
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  const data = await VideoService.getWatchLater(req.body, userId)
  return res.status(200).json({
    code: 0,
    data,
  })
}

export const videoGetDetail: RequestHandler<ParamsDictionary, Result<VideoGetDetail>> = async (
  req,
  res
) => {
  const videoId = req.params.videoId
  const userId = req.user?.id
  if (!videoId || !userId) {
    return res.status(400).json({
      code: 400,
      message: MESSAGE.INVALID_PARAMS,
    })
  }
  const data = await VideoService.getDetail(videoId, userId)
  return res.status(200).json({
    code: 0,
    data,
  })
}

export const videoShare: RequestHandler<ParamsDictionary, Result, VideoShareDTO> = async (
  req,
  res
) => {
  const userId = req.user?.id
  if (!userId) {
    return res.status(400).json({
      code: 400,
      message: MESSAGE.INVALID_PARAMS,
    })
  }
  await VideoService.share(userId, req.body)
  return res.status(200).json({
    code: 0,
  })
}

export const videoListLike: RequestHandler<ParamsDictionary, Result<VideoList>> = async (
  req,
  res
) => {
  const userId = req.params.userId
  if (!userId)
    return res.status(401).json({
      code: 400,
      message: MESSAGE.INVALID_PARAMS,
    })
  const data = await VideoService.listLike(userId)
  return res.status(200).json({
    code: 0,
    data,
  })
}

export const videoListSpace: RequestHandler<
  ParamsDictionary,
  Result<PageResult<VideoListItem>>,
  VideoListSpaceDTO
> = async (req, res) => {
  const data = await VideoService.listSpace(req.body)
  return res.status(200).json({
    code: 0,
    data,
  })
}
