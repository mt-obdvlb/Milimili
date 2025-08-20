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
import { videoListDTO } from '@/dtos/video/list.dto'
import { videoCreateDTO } from '@/dtos/video/create.dto'
import { videoGetDanmakusDTO } from '@/dtos/video/get-danmakus.dto'
import { videoAddDanmakuDTO } from '@/dtos/video/add-danmaku.dto'

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
