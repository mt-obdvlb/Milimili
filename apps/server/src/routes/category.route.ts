import { Router } from 'express'
import { categoryCreate, categoryGetAll } from '@/controllers/category.controller'
import { authMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'

const router = Router()

router.get('/', asyncHandler(categoryGetAll))
router.post('/', authMiddleware, asyncHandler(categoryCreate))

export default router
