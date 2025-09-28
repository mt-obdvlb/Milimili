import { LikeDTO, LikeGetDTO, Result, UnlikeDTO } from '@mtobdvlb/shared-types'
import { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LikeService } from '@/services'
import { MESSAGE } from '@/constants'

export const like: RequestHandler<ParamsDictionary, Result, LikeDTO> = async (req, res) => {
  const userId = req.user?.id
  if (!userId) {
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  }
  await LikeService.like(userId, req.body)
  return res.status(200).json({
    code: 0,
  })
}

export const unlike: RequestHandler<ParamsDictionary, Result, UnlikeDTO> = async (req, res) => {
  const userId = req.user?.id
  if (!userId) {
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  }
  await LikeService.unlike(userId, req.body)
  return res.status(200).json({
    code: 0,
  })
}

export const likeGet: RequestHandler<ParamsDictionary, Result, LikeGetDTO> = async (req, res) => {
  const userId = req.user?.id
  if (!userId) {
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  }
  const code = await LikeService.isLike(userId, req.body)
  return res.status(200).json({
    code,
  })
}
