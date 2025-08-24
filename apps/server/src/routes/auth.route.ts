import { Router } from 'express'
import { authRefresh, authSendCode } from '@/controllers/auth.controller'
import { validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import { authSendCodeDTO } from '@mtobdvlb/shared-types'

const router = Router()

router.post('/refresh', asyncHandler(authRefresh))
router.post(
  '/send-code',
  validatorMiddleware({ body: authSendCodeDTO }),
  asyncHandler(authSendCode)
)

export default router
