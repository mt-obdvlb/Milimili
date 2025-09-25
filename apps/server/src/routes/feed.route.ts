import { Router } from 'express'
import { authMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import { feedFollowingList, feedRecent } from '@/controllers'

const router = Router()

router.get('/recent', authMiddleware, asyncHandler(feedRecent))
router.get('/following', authMiddleware, asyncHandler(feedFollowingList))

export default router
