import { Router } from 'express'
import { videoUploadURL } from '@/controllers/video.controller'
import { authMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'

const router = Router()

router.get('/upload-url', authMiddleware, asyncHandler(videoUploadURL))

export default router
