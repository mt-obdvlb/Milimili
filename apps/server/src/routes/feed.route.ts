import { Router } from 'express'
import { authMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import { feedRecent } from '@/controllers'

const router = Router()

router.get('/recent', authMiddleware, asyncHandler(feedRecent))

export default router
