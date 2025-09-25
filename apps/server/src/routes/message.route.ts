import { Router } from 'express'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import { messageList, messageSendWhisper, messageStatistics } from '@/controllers'
import { messageListDTO, messageSendWhisperDTO } from '@mtobdvlb/shared-types'

const router = Router()

router.get('/statistics', authMiddleware, asyncHandler(messageStatistics))
router.post(
  '/send-whisper',
  authMiddleware,
  validatorMiddleware({ body: messageSendWhisperDTO }),
  asyncHandler(messageSendWhisper)
)
router.get(
  '/',
  authMiddleware,
  validatorMiddleware({ query: messageListDTO }),
  asyncHandler(messageList)
)

export default router
