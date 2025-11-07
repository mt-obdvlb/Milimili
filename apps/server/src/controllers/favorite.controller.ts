import { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  FavoriteAddBatchDTO,
  FavoriteAddDTO,
  FavoriteDeleteBatchDTO,
  FavoriteFolderAddDTO,
  FavoriteFolderList,
  FavoriteFolderListItem,
  FavoriteListDTO,
  FavoriteListItem,
  FavoriteMoveBatchDTO,
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
  const userId = req.params.id || req.user?.id
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
  const userId = req.body.userId || req.user?.id

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
  await FavoriteService.add(req.body)
  return res.status(200).json({
    code: 0,
  })
}

export const favoriteDeleteBatch: RequestHandler<
  ParamsDictionary,
  Result,
  FavoriteDeleteBatchDTO
> = async (req, res) => {
  await FavoriteService.deleteBatch(req.body)
  return res.status(200).json({
    code: 0,
  })
}

export const favoriteCleanWatchLater: RequestHandler<ParamsDictionary, Result> = async (
  req,
  res
) => {
  if (!req.user?.id)
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  await FavoriteService.cleanWatchLater(req.user.id)
  return res.status(200).json({
    code: 0,
  })
}

export const favoriteAddBatch: RequestHandler<
  ParamsDictionary,
  Result,
  FavoriteAddBatchDTO
> = async (req, res) => {
  if (!req.user?.id)
    return res.status(401).json({
      code: 401,
      message: MESSAGE.AUTH_ERROR,
    })
  await FavoriteService.addBatch(req.body, req.user?.id)
  return res.status(200).json({
    code: 0,
  })
}

export const favoriteMoveBatch: RequestHandler<
  ParamsDictionary,
  Result,
  FavoriteMoveBatchDTO
> = async (req, res) => {
  await FavoriteService.moveBatch(req.body)
  return res.status(200).json({
    code: 0,
  })
}

export const favoriteFolderAdd: RequestHandler<
  ParamsDictionary,
  Result,
  FavoriteFolderAddDTO
> = async (req, res) => {
  if (!req.user?.id)
    return res.status(401).json({
      code: 1,
      message: MESSAGE.AUTH_ERROR,
    })
  await FavoriteService.folderAdd(req.body, req.user.id)
  return res.status(200).json({
    code: 0,
  })
}

export const favoriteGetByVideoId: RequestHandler<
  ParamsDictionary,
  Result<FavoriteListItem>
> = async (req, res) => {
  const videoId = req.params.videoId
  const userId = req.user?.id
  if (!userId || !videoId)
    return res.status(401).json({
      code: 400,
      message: MESSAGE.AUTH_ERROR,
    })
  const code = await FavoriteService.get(videoId, userId)
  return res.status(200).json({
    code,
  })
}

export const favoriteDetailGetByFolderId: RequestHandler<
  ParamsDictionary,
  Result<FavoriteFolderListItem>
> = async (req, res) => {
  const folderId = req.params.folderId
  if (!folderId)
    return res.status(401).json({
      code: 400,
      message: MESSAGE.INVALID_PARAMS,
    })
  const data = await FavoriteService.detailByFolderId(folderId)
  return res.status(200).json({
    code: 0,
    data,
  })
}
