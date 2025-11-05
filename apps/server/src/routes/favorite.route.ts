import { Router } from 'express'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import {
  favoriteAdd,
  favoriteAddBatch,
  favoriteCleanWatchLater,
  favoriteDeleteBatch,
  favoriteFolderAdd,
  favoriteFolderList,
  favoriteGetByVideoId,
  favoriteList,
  favoriteMoveBatch,
  favoriteRecent,
} from '@/controllers/favorite.controller'
import {
  favoriteAddBatchDTO,
  favoriteAddDTO,
  favoriteDeleteBatchDTO,
  favoriteFolderAddDTO,
  favoriteListDTO,
  favoriteMoveBatchDTO,
} from '@mtobdvlb/shared-types'

const router = Router()

router.get('/folder', authMiddleware, asyncHandler(favoriteFolderList))
router.get('/folder/:id', asyncHandler(favoriteFolderList))
router.get(
  '/',
  authMiddleware,
  validatorMiddleware({ query: favoriteListDTO }),
  asyncHandler(favoriteList)
)
router.get('/recent', authMiddleware, asyncHandler(favoriteRecent))
router.post(
  '/',
  authMiddleware,
  validatorMiddleware({ body: favoriteAddDTO }),
  asyncHandler(favoriteAdd)
)
router.post(
  '/batch',
  authMiddleware,
  validatorMiddleware({ body: favoriteAddBatchDTO }),
  asyncHandler(favoriteAddBatch)
)
router.delete(
  '/',
  authMiddleware,
  validatorMiddleware({ body: favoriteDeleteBatchDTO }),
  asyncHandler(favoriteDeleteBatch)
)
router.post('/clean-watch-later', authMiddleware, asyncHandler(favoriteCleanWatchLater))
router.post(
  '/move-batch',
  authMiddleware,
  validatorMiddleware({ body: favoriteMoveBatchDTO }),
  asyncHandler(favoriteMoveBatch)
)
router.post(
  '/folder',
  authMiddleware,
  validatorMiddleware({ body: favoriteFolderAddDTO }),
  asyncHandler(favoriteFolderAdd)
)
router.get('/videoId/:videoId', authMiddleware, asyncHandler(favoriteGetByVideoId))

export default router
