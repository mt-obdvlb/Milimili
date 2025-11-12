import { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  FeedCreateDTO,
  FeedDeleteDTO,
  FeedFollowingList,
  FeedGetById,
  FeedGetByIdDTO,
  FeedListDTO,
  FeedListItem,
  FeedListLikeTranspontDTO,
  FeedListLikeTranspontItem,
  FeedRecentList,
  FeedTranpont,
  FeedTranspontDTO,
  PageResult,
  Result,
} from '@mtobdvlb/shared-types'
import { MESSAGE } from '@/constants'
import { FeedService } from '@/services/feed.service'

export const feedRecent: RequestHandler<ParamsDictionary, Result<FeedRecentList>> = async (
  req,
  res
) => {
  const userId = req.user?.id
  if (!userId)
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  const data = await FeedService.recent(userId)
  return res.status(200).json({
    code: 0,
    data,
  })
}

export const feedFollowingList: RequestHandler<
  ParamsDictionary,
  Result<FeedFollowingList>
> = async (req, res) => {
  const userId = req.user?.id
  if (!userId)
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  const data = await FeedService.followingList(userId)
  return res.status(200).json({
    code: 0,
    data,
  })
}

export const feedCreate: RequestHandler<ParamsDictionary, Result, FeedCreateDTO> = async (
  req,
  res
) => {
  const userId = req.user?.id
  if (!userId)
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  await FeedService.create(userId, req.body)
  return res.status(200).json({
    code: 0,
  })
}

export const feedList: RequestHandler<
  ParamsDictionary,
  Result<PageResult<FeedListItem>>,
  FeedListDTO
> = async (req, res) => {
  const userId = req.user?.id
  if (!userId)
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  const { list, total } = await FeedService.list(userId, req.body)
  return res.status(200).json({
    code: 0,
    data: {
      total,
      list,
    },
  })
}

export const feedDelete: RequestHandler<ParamsDictionary, Result, FeedDeleteDTO> = async (
  req,
  res
) => {
  const userId = req.user?.id
  if (!userId)
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  await FeedService.delete(userId, req.body)
  return res.status(200).json({
    code: 0,
  })
}

export const feedGetById: RequestHandler<
  ParamsDictionary,
  Result<FeedGetById>,
  FeedGetByIdDTO
> = async (req, res) => {
  const data = await FeedService.getById(req.body)
  return res.status(200).json({
    code: 0,
    data,
  })
}

export const feedTranspont: RequestHandler<
  ParamsDictionary,
  Result<FeedTranpont>,
  FeedTranspontDTO
> = async (req, res) => {
  const userId = req.user?.id
  if (!userId)
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  await FeedService.transpont(userId, req.body)
  return res.status(200).json({
    code: 0,
  })
}

export const feedListLikeTranspont: RequestHandler<
  ParamsDictionary,
  Result<PageResult<FeedListLikeTranspontItem>>,
  FeedListLikeTranspontDTO
> = async (req, res) => {
  const { list, total } = await FeedService.listLikeTranspont(req.params.id as string, req.body)
  return res.status(200).json({
    code: 0,
    data: {
      list,
      total,
    },
  })
}
