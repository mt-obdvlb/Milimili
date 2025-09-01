import { Router } from 'express'
import { validatorMiddleware } from '@/middlewares'
import { searchGetDTO } from '@mtobdvlb/shared-types'
import { asyncHandler } from '@/utils'
import { searchGet } from '@/controllers'

const router = Router()

router.get(
  '/',
  validatorMiddleware({
    query: searchGetDTO,
  }),
  asyncHandler(searchGet)
)

export default router
