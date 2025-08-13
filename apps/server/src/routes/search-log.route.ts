import { Router } from 'express'
import { asyncHandler } from '@/utils'
import { searchLogAdd, searchLogTop10 } from '@/controllers/search-log.controller'

const router = Router()

router.post('/search-log', asyncHandler(searchLogAdd))
router.get('/search-log/top10', asyncHandler(searchLogTop10))

export default router
