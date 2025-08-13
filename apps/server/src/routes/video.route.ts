import { Router } from 'express'
import { videoCreate, videoList, videoUploadURL } from '@/controllers/video.controller'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import { videoListDTO } from '@/dtos/video/list.dto'
import { videoCreateDTO } from '@/dtos/video/create.dto'

const router = Router()

router.get('/upload-url', authMiddleware, asyncHandler(videoUploadURL))
router.get('/list', validatorMiddleware({ query: videoListDTO }), asyncHandler(videoList))
router.post(
  '/',
  authMiddleware,
  validatorMiddleware({ body: videoCreateDTO }),
  asyncHandler(videoCreate)
)

export default router
