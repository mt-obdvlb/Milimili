import { Router } from 'express'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import { likeDTO, likeGetDTO, unlikeDto } from '@mtobdvlb/shared-types'
import { like, likeGet, unlike } from '@/controllers'

const router = Router()

router.get('/', authMiddleware, validatorMiddleware({ query: likeGetDTO }), asyncHandler(likeGet))

router.post('/', authMiddleware, validatorMiddleware({ body: likeDTO }), asyncHandler(like))

router.delete('/', authMiddleware, validatorMiddleware({ query: unlikeDto }), asyncHandler(unlike))

export default router
