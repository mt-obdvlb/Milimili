import { Router } from 'express'
import {
  videoAddDanmaku,
  videoCreate,
  videoGetDanmakus,
  videoGetDetail,
  videoGetWatchLater,
  videoList,
  videoListLike,
  videoShare,
} from '@/controllers/video.controller'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import {
  videoAddDanmakuDTO,
  videoCreateDTO,
  videoGetDanmakusDTO,
  videoGetWatchLaterDTO,
  videoListDTO,
  videoShareDTO,
} from '@mtobdvlb/shared-types'

const router = Router()

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
router.get(
  '/watch-later',
  authMiddleware,
  validatorMiddleware({ query: videoGetWatchLaterDTO }),
  asyncHandler(videoGetWatchLater)
)
router.get('/detail/:videoId', authMiddleware, asyncHandler(videoGetDetail))
router.post(
  '/share',
  authMiddleware,
  validatorMiddleware({ body: videoShareDTO }),
  asyncHandler(videoShare)
)
router.get('/list-like/:userId', asyncHandler(videoListLike))

export default router
