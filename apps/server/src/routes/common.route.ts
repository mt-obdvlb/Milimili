import { Router } from 'express'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { commonUploadDTO } from '@mtobdvlb/shared-types'
import { asyncHandler } from '@/utils'
import { commonUploadFile } from '@/controllers'

const router = Router()

router.get(
  '/upload',
  authMiddleware,
  validatorMiddleware({ query: commonUploadDTO }),
  asyncHandler(commonUploadFile)
)

export default router
