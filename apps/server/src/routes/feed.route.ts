import { Router } from 'express'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import { feedCreate, feedFollowingList, feedRecent } from '@/controllers'
import { feedCreateDTO } from '@mtobdvlb/shared-types'

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

export default router
