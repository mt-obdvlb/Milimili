import { Router } from 'express'
import {
  videoAddDanmaku,
  videoCreate,
  videoGetDanmakus,
  videoList,
  videoUploadURL,
} from '@/controllers/video.controller'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import {
  videoAddDanmakuDTO,
  videoCreateDTO,
  videoGetDanmakusDTO,
  videoListDTO,
} from '@mtobdvlb/shared-types'

const router = Router()

router.get('/upload-url', authMiddleware, asyncHandler(videoUploadURL))
router.get('/list', validatorMiddleware({ query: videoListDTO }), asyncHandler(videoList))
router.post(
  '/',
  authMiddleware,
  validatorMiddleware({ body: videoCreateDTO }),
  asyncHandler(videoCreate)
)
router.get(
  '/danmakus/:videoId',
  validatorMiddleware({ params: videoGetDanmakusDTO }),
  asyncHandler(videoGetDanmakus)
)
router.post(
  '/danmakus',
  authMiddleware,
  validatorMiddleware({ body: videoAddDanmakuDTO }),
  asyncHandler(videoAddDanmaku)
)

export default router
