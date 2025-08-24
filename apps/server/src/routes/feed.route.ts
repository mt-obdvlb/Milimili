import { Router } from 'express'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import { feedRecent } from '@/controllers'
import { feedListDTO } from '@mtobdvlb/shared-types'

const router = Router()

router.get(
  '/recent',
  authMiddleware,
  validatorMiddleware({ query: feedListDTO }),
  asyncHandler(feedRecent)
)

export default router
