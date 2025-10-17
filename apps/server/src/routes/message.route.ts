import { Router } from 'express'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import {
  messageCreateConversation,
  messageDeleteConversation,
  messageGetConversation,
  messageList,
  messageRead,
  messageSendWhisper,
  messageStatistics,
} from '@/controllers'
import {
  messageCreateConversationDTO,
  messageDeleteConversationDTO,
  messageGetConversationDTO,
  messageListDTO,
  messageReadDTO,
  messageSendWhisperDTO,
} from '@mtobdvlb/shared-types'

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
router.get(
  '/conversation/:conversationId',
  authMiddleware,
  validatorMiddleware({ params: messageGetConversationDTO }),
  asyncHandler(messageGetConversation)
)

router.post(
  '/conversation/:userId',
  authMiddleware,
  validatorMiddleware({ params: messageCreateConversationDTO }),
  asyncHandler(messageCreateConversation)
)
router.delete(
  '/conversation/:conversationId',
  authMiddleware,
  validatorMiddleware({ params: messageDeleteConversationDTO }),
  asyncHandler(messageDeleteConversation)
)
router.put('/read', validatorMiddleware({ body: messageReadDTO }), asyncHandler(messageRead))

export default router
