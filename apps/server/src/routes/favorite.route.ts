import { Router } from 'express'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import {
  favoriteAdd,
  favoriteFolderList,
  favoriteList,
  favoriteRecent,
} from '@/controllers/favorite.controller'
import { favoriteAddDTO, favoriteListDTO } from '@mtobdvlb/shared-types'

const router = Router()

router.get('/folder', authMiddleware, asyncHandler(favoriteFolderList))
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

export default router
