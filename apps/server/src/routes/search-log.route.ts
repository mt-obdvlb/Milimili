import { Router } from 'express'
import { asyncHandler } from '@/utils'
import { searchLogAdd, searchLogTop10 } from '@/controllers/search-log.controller'
import { validatorMiddleware } from '@/middlewares'
import { searchLogAddDTO } from '@mtobdvlb/shared-types'

const router = Router()

router.post('/', validatorMiddleware({ body: searchLogAddDTO }), asyncHandler(searchLogAdd))
router.get('/top10', asyncHandler(searchLogTop10))

export default router
