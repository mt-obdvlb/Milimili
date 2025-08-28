import { Router } from 'express'
import { categoryCreate, categoryGetAll, categoryGetById } from '@/controllers/category.controller'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import { categoryGetDTO } from '@mtobdvlb/shared-types'

const router = Router()

router.get('/', asyncHandler(categoryGetAll))
router.post('/', authMiddleware, asyncHandler(categoryCreate))
router.get('/:id', validatorMiddleware({ params: categoryGetDTO }), asyncHandler(categoryGetById))

export default router
