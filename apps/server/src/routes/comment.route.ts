import { Router } from 'express'
import { commentDTO, commentGetDTO } from '@mtobdvlb/shared-types'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import { comment, commentGet } from '@/controllers'

const router = Router()

router.post(
  '/',
  authMiddleware,
  validatorMiddleware({
    body: commentDTO,
  }),
  asyncHandler(comment)
)

router.get(
  '/',
  validatorMiddleware({
    query: commentGetDTO,
  }),
  asyncHandler(commentGet)
)

export default router
