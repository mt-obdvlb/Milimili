import { RequestHandler } from 'express'
import { FollowCreateDTO, FollowDeleteDTO, FollowGetDTO, Result } from '@mtobdvlb/shared-types'
import { ParamsDictionary } from 'express-serve-static-core'
import { MESSAGE } from '@/constants'
import { FollowService } from '@/services/follow.service'

export const followGet: RequestHandler<ParamsDictionary, Result, FollowGetDTO> = async (
  req,
  res
) => {
  const userId = req.user?.id
  if (!userId)
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })

  const { code } = await FollowService.get({
    userId,
    followingId: req.body.followingId,
  })
  return res.status(200).json({
    code,
  })
}

export const followCreate: RequestHandler<ParamsDictionary, Result, FollowCreateDTO> = async (
  req,
  res
) => {
  const userId = req.user?.id
  if (!userId)
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })

  await FollowService.create({
    userId,
    followingId: req.body.followingId,
  })
  return res.status(200).json({
    code: 0,
  })
}

export const followDelete: RequestHandler<ParamsDictionary, Result, FollowDeleteDTO> = async (
  req,
  res
) => {
  const userId = req.user?.id
  if (!userId)
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })

  await FollowService.delete({
    userId,
    followingId: req.body.followingId,
  })
  return res.status(200).json({ code: 0 })
}
