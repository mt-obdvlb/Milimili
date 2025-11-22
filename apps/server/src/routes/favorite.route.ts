import { Router } from 'express'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import {
  favoriteAddBatch,
  favoriteCleanWatchLater,
  favoriteDeleteBatch,
  favoriteDetailGetByFolderId,
  favoriteFolderAdd,
  favoriteFolderDelete,
  favoriteFolderList,
  favoriteFolderUpdate,
  favoriteGetByVideoId,
  favoriteIsWatchLater,
  favoriteList,
  favoriteMoveBatch,
  favoriteRecent,
  favoriteWatchLaterAddOrDelete,
} from '@/controllers/favorite.controller'
import {
  favoriteAddBatchDTO,
  favoriteDeleteBatchDTO,
  favoriteFolderAddDTO,
  favoriteFolderUpdateDTO,
  favoriteListDTO,
  favoriteMoveBatchDTO,
} from '@mtobdvlb/shared-types'

const router = Router()

router.get('/folder', authMiddleware, asyncHandler(favoriteFolderList))
router.get('/folder/:userId', asyncHandler(favoriteFolderList))
router.get('/', validatorMiddleware({ query: favoriteListDTO }), asyncHandler(favoriteList))
router.get('/recent', authMiddleware, asyncHandler(favoriteRecent))
router.get('/detail/:folderId', asyncHandler(favoriteDetailGetByFolderId))

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
router.delete('/folder/:folderId', authMiddleware, asyncHandler(favoriteFolderDelete))
router.put(
  '/folder/:folderId',
  authMiddleware,
  validatorMiddleware({ body: favoriteFolderUpdateDTO }),
  asyncHandler(favoriteFolderUpdate)
)
router.put('/watch-later/:videoId', authMiddleware, asyncHandler(favoriteWatchLaterAddOrDelete))
router.get('/watch-later/:videoId', authMiddleware, asyncHandler(favoriteIsWatchLater))

export default router
