import { Router } from 'express'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { historyAdd, historyList, historyRecent } from '@/controllers/history.controller'
import { asyncHandler } from '@/utils'
import { historyAddDTO, historyListDTO } from '@mtobdvlb/shared-types'

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

export default router
