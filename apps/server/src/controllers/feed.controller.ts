// export const feedList: RequestHandler<
//   ParamsDictionary,
//   Result<PageResult<FeedListItem>, FeedListDTO>
// > = async (req, res) => {}

import { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { FeedListDTO, FeedRecentList, Result } from '@mtobdvlb/shared-types'
import { MESSAGE } from '@/constants'
import { FeedService } from '@/services/feed.service'

export const feedRecent: RequestHandler<
  ParamsDictionary,
  Result<FeedRecentList>,
  FeedListDTO
> = async (req, res) => {
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
