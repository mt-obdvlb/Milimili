import { Router } from 'express'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import {
  feedCreate,
  feedDelete,
  feedFollowingList,
  feedGetById,
  feedList,
  feedRecent,
  feedTranspont,
} from '@/controllers'
import {
  feedCreateDTO,
  feedDeleteDTO,
  feedGetByIdDTO,
  feedListDTO,
  feedTranspontDTO,
} from '@mtobdvlb/shared-types'

const router = Router()

router.get('/recent', authMiddleware, asyncHandler(feedRecent))
router.get('/following', authMiddleware, asyncHandler(feedFollowingList))
router.post(
  '/',
  authMiddleware,
  validatorMiddleware({
    body: feedCreateDTO,
  }),
  asyncHandler(feedCreate)
)
router.get(
  '/',
  authMiddleware,
  validatorMiddleware({
    query: feedListDTO,
  }),
  asyncHandler(feedList)
)
router.delete(
  '/:id',
  authMiddleware,
  validatorMiddleware({ params: feedDeleteDTO }),
  asyncHandler(feedDelete)
)
router.get(
  '/:id',
  authMiddleware,
  validatorMiddleware({ params: feedGetByIdDTO }),
  asyncHandler(feedGetById)
)
router.post(
  '/transpont',
  authMiddleware,
  validatorMiddleware({
    body: feedTranspontDTO,
  }),
  asyncHandler(feedTranspont)
)

export default router
