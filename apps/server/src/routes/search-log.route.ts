import { Router } from 'express'
import { asyncHandler } from '@/utils'
import { searchLogAdd, searchLogGet, searchLogTop10 } from '@/controllers/search-log.controller'
import { validatorMiddleware } from '@/middlewares'
import { searchLogAddDTO, searchLogGetDTO } from '@mtobdvlb/shared-types'

const router = Router()

router.post('/', validatorMiddleware({ body: searchLogAddDTO }), asyncHandler(searchLogAdd))
router.get('/top10', asyncHandler(searchLogTop10))
router.get('/', validatorMiddleware({ query: searchLogGetDTO }), asyncHandler(searchLogGet))

export default router
