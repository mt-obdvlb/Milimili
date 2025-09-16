import { Router } from 'express'
import { authMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import { notificationStatistics } from '@/controllers'

const router = Router()

router.get('/statistics', authMiddleware, asyncHandler(notificationStatistics))

export default router
