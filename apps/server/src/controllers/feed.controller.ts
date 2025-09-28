// export const feedList: RequestHandler<
//   ParamsDictionary,
//   Result<PageResult<FeedListItem>, FeedListDTO>
// > = async (req, res) => {}

import { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  FeedCreateDTO,
  FeedFollowingList,
  FeedListDTO,
  FeedListItem,
  FeedRecentList,
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
