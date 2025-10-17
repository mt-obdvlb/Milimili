import { Router } from 'express'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import {
  messageCreateConversation,
  messageDelete,
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
  messageDeleteDTO,
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
  '/conversation/:userId',
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
router.put(
  '/read',
  authMiddleware,
  validatorMiddleware({ body: messageReadDTO }),
  asyncHandler(messageRead)
)
router.delete(
  '/:id',
  authMiddleware,
  validatorMiddleware({
    params: messageDeleteDTO,
  }),
  asyncHandler(messageDelete)
)

export default router
