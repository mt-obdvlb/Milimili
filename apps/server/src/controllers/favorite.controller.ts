import { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { PageResult, Result } from '@mtobdvlb/shared-types'
import { FavoriteListDTO } from '@/dtos/favorite/list.dto'
import { FavoriteService } from '@/services/favorite.service'
import { MESSAGE } from '@/constants'
import { FavoriteFolderListVO } from '@/vos/favorite/folder-list.vo'
import { FavoriteListItem, FavoriteRecentVO } from '@/vos/favorite/list.vo'

export const favoriteFolderList: RequestHandler<
  ParamsDictionary,
  Result<FavoriteFolderListVO>
> = async (req, res) => {
  const userId = req.user?.id
  if (!userId)
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  const data = await FavoriteService.listFolder(userId)
  return res.status(200).json({
    code: 0,
    data,
  })
}

export const favoriteList: RequestHandler<
  ParamsDictionary,
  Result<PageResult<FavoriteListItem>>,
  FavoriteListDTO
> = async (req, res) => {
  const userId = req.user?.id
  if (!userId)
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  req.body.userId = userId
  const { total, list } = await FavoriteService.list(req.body)
  return res.status(200).json({
    code: 0,
    data: {
      total,
      list,
    },
  })
}

export const favoriteRecent: RequestHandler<ParamsDictionary, Result<FavoriteRecentVO>> = async (
  req,
  res
) => {
  const userId = req.user?.id
  if (!userId)
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  const data = await FavoriteService.listRecent(userId)
  return res.status(200).json({
    code: 0,
    data,
  })
}
