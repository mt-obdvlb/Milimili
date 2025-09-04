import { Router } from 'express'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import { followCreateDTO, followDeleteDTO, followGetDTO } from '@mtobdvlb/shared-types'
import { followCreate, followDelete, followGet } from '@/controllers/follow.controller'

const router = Router()

router.get(
  '/',
  authMiddleware,
  validatorMiddleware({ query: followGetDTO }),
  asyncHandler(followGet)
)

router.post(
  '/',
  authMiddleware,
  validatorMiddleware({ body: followCreateDTO }),
  asyncHandler(followCreate)
)

router.delete(
  '/',
  authMiddleware,
  validatorMiddleware({ body: followDeleteDTO }),
  asyncHandler(followDelete)
)

export default router
