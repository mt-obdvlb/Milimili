import { Router } from 'express'
import { commentDeleteDTO, commentDTO, commentGetDTO } from '@mtobdvlb/shared-types'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import { comment, commentDelete, commentGet } from '@/controllers'

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

router.delete(
  '/:id',
  authMiddleware,
  validatorMiddleware({
    params: commentDeleteDTO,
  }),
  asyncHandler(commentDelete)
)

export default router
