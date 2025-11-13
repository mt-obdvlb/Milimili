import { Router } from 'express'
import {
  videoAddDanmaku,
  videoCreateOrUpdate,
  videoDelete,
  videoGetDanmakus,
  videoGetDetail,
  videoGetWatchLater,
  videoList,
  videoListLike,
  videoListSpace,
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
  videoListSpaceDTO,
  videoShareDTO,
} from '@mtobdvlb/shared-types'

const router = Router()

router.get('/list', validatorMiddleware({ query: videoListDTO }), asyncHandler(videoList))
router.get(
  '/list-space',
  validatorMiddleware({ query: videoListSpaceDTO }),
  asyncHandler(videoListSpace)
)
router.post(
  '/',
  authMiddleware,
  validatorMiddleware({ body: videoCreateDTO }),
  asyncHandler(videoCreateOrUpdate)
)
router.put(
  '/:videoId',
  authMiddleware,
  validatorMiddleware({ body: videoCreateDTO }),
  asyncHandler(videoCreateOrUpdate)
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
router.delete('/:videoId', authMiddleware, asyncHandler(videoDelete))

export default router
