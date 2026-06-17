import { Router } from 'express'
import { healthz, readyz } from '@/controllers/health.controller'
import { asyncHandler } from '@/utils'

const router = Router()

router.get('/healthz', healthz)
router.get('/readyz', asyncHandler(readyz))

export default router
