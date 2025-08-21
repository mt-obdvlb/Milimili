import { Router } from 'express'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import { favoriteFolderList, favoriteList, favoriteRecent } from '@/controllers/favorite.controller'
import { favoriteListDTO } from '@/dtos/favorite/list.dto'

const router = Router()

router.get('/folder', authMiddleware, asyncHandler(favoriteFolderList))
router.get(
  '/',
  authMiddleware,
  validatorMiddleware({ query: favoriteListDTO }),
  asyncHandler(favoriteList)
)
router.get('/recent', authMiddleware, asyncHandler(favoriteRecent))

export default router
