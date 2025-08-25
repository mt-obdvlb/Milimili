import { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  FavoriteAddDTO,
  FavoriteFolderList,
  FavoriteListDTO,
  FavoriteListItem,
  FavoriteRecentList,
  PageResult,
  Result,
} from '@mtobdvlb/shared-types'
import { FavoriteService } from '@/services/favorite.service'
import { MESSAGE } from '@/constants'

export const favoriteFolderList: RequestHandler<
  ParamsDictionary,
  Result<FavoriteFolderList>
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

export const favoriteRecent: RequestHandler<ParamsDictionary, Result<FavoriteRecentList>> = async (
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

export const favoriteAdd: RequestHandler<ParamsDictionary, Result, FavoriteAddDTO> = async (
  req,
  res
) => {
  if (!req.user?.id)
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  req.body.userId = req.user.id
  console.log(req.body)
  await FavoriteService.add(req.body)
  return res.status(200).json({
    code: 0,
  })
}
