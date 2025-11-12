import { Router } from 'express'
import {
  categoryCreate,
  categoryGetAll,
  categoryGetById,
  categoryGetByName,
} from '@/controllers/category.controller'
import { authMiddleware, validatorMiddleware } from '@/middlewares'
import { asyncHandler } from '@/utils'
import { categoryGetByNameDTO, categoryGetDTO } from '@mtobdvlb/shared-types'

const router = Router()

router.get('/', asyncHandler(categoryGetAll))
router.post('/', authMiddleware, asyncHandler(categoryCreate))
router.get(
  '/name',
  validatorMiddleware({ query: categoryGetByNameDTO }),
  asyncHandler(categoryGetByName)
)
router.get(
  '/id/:id',
  validatorMiddleware({ params: categoryGetDTO }),
  asyncHandler(categoryGetById)
)

export default router
