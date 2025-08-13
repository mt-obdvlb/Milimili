import { Router } from 'express'
import { authRefresh, authSendCode } from '@/controllers/auth.controller'
import { validatorMiddleware } from '@/middlewares'
import { authSendCodeDTO } from '@/dtos/auth/send-code.dto'
import { asyncHandler } from '@/utils'

const router = Router()

router.post('/refresh', asyncHandler(authRefresh))
router.post(
  '/send-code',
  validatorMiddleware({ body: authSendCodeDTO }),
  asyncHandler(authSendCode)
)

export default router
