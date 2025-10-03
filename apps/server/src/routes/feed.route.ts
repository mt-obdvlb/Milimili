import { Router } from 'express'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import {
  feedCreate,
  feedDelete,
  feedFollowingList,
  feedGetById,
  feedList,
  feedListLikeTranspont,
  feedRecent,
  feedTranspont,
} from '@/controllers'
import {
  feedCreateDTO,
  feedDeleteDTO,
  feedGetByIdDTO,
  feedListDTO,
  feedListLikeTranspontDTO,
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
router.get('/:id', validatorMiddleware({ params: feedGetByIdDTO }), asyncHandler(feedGetById))
router.post(
  '/transpont',
  authMiddleware,
  validatorMiddleware({
    body: feedTranspontDTO,
  }),
  asyncHandler(feedTranspont)
)
router.get(
  '/:id/like-transpont',
  validatorMiddleware({ query: feedListLikeTranspontDTO }),
  asyncHandler(feedListLikeTranspont)
)

export default router
