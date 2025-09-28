import { Router } from 'express'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import { feedCreate, feedFollowingList, feedList, feedRecent } from '@/controllers'
import { feedCreateDTO, feedListDTO } from '@mtobdvlb/shared-types'

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

export default router
