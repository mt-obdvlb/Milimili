import { Router } from 'express'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import {
  historyAdd,
  historyClearUp,
  historyDeleteBatch,
  historyGet,
  historyList,
  historyRecent,
} from '@/controllers/history.controller'
import { asyncHandler } from '@/utils'
import {
  historyAddDTO,
  historyDeleteBatchDTO,
  historyGetDTO,
  historyListDTO,
} from '@mtobdvlb/shared-types'

const router = Router()

router.get(
  '/',
  authMiddleware,
  validatorMiddleware({ query: historyListDTO }),
  asyncHandler(historyList)
)
router.get('/recent', authMiddleware, asyncHandler(historyRecent))
router.post(
  '/',
  authMiddleware,
  validatorMiddleware({ body: historyAddDTO }),
  asyncHandler(historyAdd)
)
router.delete(
  '/',
  authMiddleware,
  validatorMiddleware({ body: historyDeleteBatchDTO }),
  asyncHandler(historyDeleteBatch)
)
router.delete('/clear', authMiddleware, asyncHandler(historyClearUp))
router.get(
  '/list',
  authMiddleware,
  validatorMiddleware({ query: historyGetDTO }),
  asyncHandler(historyGet)
)

export default router
